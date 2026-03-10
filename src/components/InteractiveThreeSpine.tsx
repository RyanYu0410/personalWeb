import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { TranslationKey } from '../i18n/translations';

interface SpineItem {
  title: string;
  outcome: string;
  role: string;
  href: string;
}

function Particles({ hoveredIndex, rowCount, pointerPos }: { hoveredIndex: number | null; rowCount: number; pointerPos: React.RefObject<{ x: number; y: number }> }) {
  const count = 400;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const hoverStrength = useRef(0);
  const lastHoveredIndex = useRef(0);

  function initParticle(vw: number, vh: number, randomX = true) {
    const baseY = (Math.random() - 0.5) * vh;
    return {
      x: randomX ? (Math.random() - 0.5) * vw : -vw / 2 - Math.random() * 1.5 - 0.5,
      y: baseY,
      baseY,
      z: (Math.random() - 0.5) * 2,
      speedX: Math.random() * 0.02 + 0.015,
      speedY: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
      life: Math.random(),
      maxLife: 0.6 + Math.random() * 0.8,
    };
  }
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(initParticle(viewport.width, viewport.height));
    }
    return temp;
  }, [count, viewport]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const time = state.clock.elapsedTime;
    const isHovering = hoveredIndex !== null;

    if (isHovering) lastHoveredIndex.current = hoveredIndex;

    const targetStrength = isHovering ? 1 : 0;
    const rampSpeed = isHovering ? 0.06 : 0.015;
    hoverStrength.current += (targetStrength - hoverStrength.current) * rampSpeed;
    if (hoverStrength.current < 0.001) hoverStrength.current = 0;

    const str = hoverStrength.current;

    const safeCount = Math.max(rowCount, 1);
    const activeTargetY = viewport.height * (0.5 - (lastHoveredIndex.current + 0.5) / safeCount);
    
    particles.forEach((p, i) => {
      p.life += delta / p.maxLife;

      if (p.life >= 1 || p.x > viewport.width / 2 + 0.5) {
        const reset = initParticle(viewport.width, viewport.height, false);
        Object.assign(p, reset);
        p.life = 0;
      }

      p.x += p.speedX;
      p.y += p.speedY + Math.sin(time * 1.5 + p.phase) * 0.004;

      if (pointerPos.current) {
        const mx = pointerPos.current.x;
        const my = pointerPos.current.y;
        if (mx > -999) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.5 && dist > 0.01) {
            const force = (1.5 - dist) / 1.5;
            p.x -= (dx / dist) * force * 0.04;
            p.y -= (dy / dist) * force * 0.04;
          }
        }
      }

      const attractForce = (activeTargetY - p.y) * 0.08;
      const scatterForce = (p.baseY - p.y) * 0.04;
      p.y += attractForce * str + scatterForce * (1 - str);

      const boostedSpeed = 0.12 + Math.random() * 0.06;
      const baseSpeed = 0.02 + Math.random() * 0.015;
      const targetSpeed = boostedSpeed * str + baseSpeed * (1 - str);
      const speedLerp = isHovering ? 0.04 : 0.008;
      p.speedX = THREE.MathUtils.lerp(p.speedX, targetSpeed, speedLerp);

      p.speedY += (Math.random() - 0.5) * 0.002 * (1 - str * 0.8);
      p.speedY *= 0.98;

      dummy.position.set(p.x, p.y, p.z);
      const scale = 0.08 + p.speedX * 0.2;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      // Life-based fade: ease in first 20%, ease out last 30%
      let lifeFade = 1;
      if (p.life < 0.2) lifeFade = p.life / 0.2;
      else if (p.life > 0.7) lifeFade = (1 - p.life) / 0.3;
      
      const nx = (p.x + viewport.width / 2) / viewport.width;
      let alpha = 1;
      if (nx < 0.15) alpha = nx / 0.15;
      else if (nx > 0.85) alpha = (1 - nx) / 0.15;
      alpha = Math.max(0, Math.min(1, alpha * lifeFade)) * 0.8;

      const color = new THREE.Color();
      color.setRGB(
        (31 / 255) * alpha + (1 - alpha), 
        (35 / 255) * alpha + (1 - alpha), 
        (41 / 255) * alpha + (1 - alpha)
      );
      mesh.current!.setColorAt(i, color);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.7} 
        depthWrite={false} 
        map={particleTexture}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
}

interface InteractiveThreeSpineProps {
  workIndex: {
    ui: SpineItem[];
    interactive: SpineItem[];
    research: SpineItem[];
  };
  workOpen: 'ui' | 'interactive' | 'research';
  onToggleWork: (category: 'ui' | 'interactive' | 'research') => void;
  t: (k: TranslationKey) => string | readonly string[];
}

export default function InteractiveThreeSpine({ workIndex, workOpen, onToggleWork, t }: InteractiveThreeSpineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerPos = useRef({ x: -9999, y: -9999 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerPos.current = { x: nx * 3.5, y: ny * 2.5 };
  };

  const handlePointerLeave = () => {
    pointerPos.current = { x: -9999, y: -9999 };
  };

  const categories = [
    { key: 'ui' as const, titleKey: 'uiSystemsTitle' as TranslationKey, items: workIndex.ui },
    { key: 'interactive' as const, titleKey: 'interactiveTitle' as TranslationKey, items: workIndex.interactive },
    { key: 'research' as const, titleKey: 'dataResearchTitle' as TranslationKey, items: workIndex.research },
  ];

  // Build flat list of visible rows for hover index mapping
  const allRows: { catIdx: number; item: SpineItem; globalIdx: number }[] = [];
  let gi = 0;
  categories.forEach((cat, catIdx) => {
    // The category header itself
    allRows.push({ catIdx, item: { title: '', outcome: '', role: '', href: '' }, globalIdx: gi++ });
    if (workOpen === cat.key) {
      cat.items.forEach((item) => {
        allRows.push({ catIdx, item, globalIdx: gi++ });
      });
    }
  });
  const totalVisibleRows = gi;

  return (
    <div
      ref={containerRef}
      className="relative w-full my-[var(--space-xxxl)]"
      style={{ minHeight: '280px' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background Three.js Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-xl overflow-hidden" style={{ background: 'rgba(240, 239, 233, 0.12)' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={1} />
          <Particles hoveredIndex={hoveredIndex} rowCount={totalVisibleRows} pointerPos={pointerPos} />
        </Canvas>
      </div>

      {/* Foreground DOM Content */}
      <div className="relative z-10 py-[var(--space-sm)]">
        {categories.map((cat) => {
          const isOpen = workOpen === cat.key;
          return (
            <section key={cat.key} className="spine-block">
              <button
                type="button"
                className="spine-head home-spine-link"
                onClick={() => onToggleWork(cat.key)}
                onMouseEnter={() => {
                  const idx = allRows.findIndex((r) => r.catIdx === categories.indexOf(cat) && r.item.title === '');
                  setHoveredIndex(idx >= 0 ? idx : null);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-expanded={isOpen}
              >
                <span className="type-caption">#</span>
                <span className="text-[1.05rem] font-semibold text-[var(--color-text)]">{String(t(cat.titleKey))}</span>
                <span className="type-caption">{isOpen ? t('fold') : t('unfold')}</span>
              </button>
              {isOpen && (
                <div className="spine-body">
                  <ul className="spine-list">
                    {cat.items.map((item, itemIdx) => {
                      const gIdx = allRows.findIndex(
                        (r) => r.catIdx === categories.indexOf(cat) && r.item.title === item.title
                      );
                      return (
                        <li
                          key={item.title}
                          className="spine-row"
                          onMouseEnter={() => setHoveredIndex(gIdx >= 0 ? gIdx : null)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <a href={item.href} className="spine-row-link">
                            <div>
                              <p className="font-medium text-[var(--color-text)]">{item.title}</p>
                              <p className="type-body">{item.outcome}</p>
                            </div>
                            <span className="type-caption">{item.role}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
