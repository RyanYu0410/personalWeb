import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TranslationKey } from '../i18n/translations';
import BlurText from './BlurText';

gsap.registerPlugin(ScrollTrigger);

interface SpineItem {
  title: string;
  outcome: string;
  role: string;
  href: string;
  thumb?: string;
  featured?: boolean;
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
}

export default function InteractiveThreeSpine({ workIndex }: InteractiveThreeSpineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerPos = useRef({ x: -9999, y: -9999 });
  const gsapTriggersRef = useRef<ScrollTrigger[]>([]);

  const featuredCardRef = useCallback((el: HTMLAnchorElement | null) => {
    if (!el) return;

    const cardTrigger = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=5%',
          end: 'top center+=15%',
          scrub: 0.5,
        },
      },
    );

    const img = el.querySelector<HTMLElement>('.spine-featured-img');
    if (img) {
      gsap.fromTo(
        img,
        { '--scroll-opacity': 0 },
        {
          '--scroll-opacity': 0.55,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=5%',
            end: 'top center+=10%',
            scrub: 0.8,
          },
        },
      );
    }

    if (cardTrigger.scrollTrigger) gsapTriggersRef.current.push(cardTrigger.scrollTrigger);
  }, []);

  useEffect(() => {
    return () => {
      gsapTriggersRef.current.forEach((t) => t.kill());
      gsapTriggersRef.current = [];
    };
  }, []);

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

  const allRows: { catIdx: number; item: SpineItem; globalIdx: number }[] = [];
  let gi = 0;
  categories.forEach((cat, catIdx) => {
    cat.items.forEach((item) => {
      allRows.push({ catIdx, item, globalIdx: gi++ });
    });
  });
  const totalVisibleRows = gi;
  const enterEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <div
      ref={containerRef}
      className="relative w-full my-[var(--space-xxxl)]"
      style={{ minHeight: '280px' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={1} />
          <Particles hoveredIndex={hoveredIndex} rowCount={totalVisibleRows} pointerPos={pointerPos} />
        </Canvas>
      </div>

      <div className="relative z-10 py-[var(--space-sm)]">
        <motion.section
          className="spine-block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: enterEase }}
        >
          <div className="spine-body">
            <motion.ul
              className="spine-list"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.04,
                  },
                },
              }}
            >
              {allRows.map(({ item, globalIdx: gIdx }) => (
                <motion.li
                  key={item.title}
                  className={item.featured ? 'spine-row spine-row--featured' : 'spine-row'}
                  onMouseEnter={() => setHoveredIndex(gIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: enterEase },
                    },
                  }}
                  whileHover={item.featured ? undefined : { y: -1 }}
                >
                  {item.featured && item.thumb ? (
                    <a
                      ref={featuredCardRef}
                      href={item.href}
                      className="spine-row-link--featured spine-featured-gsap"
                    >
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="spine-featured-img"
                      />
                      <div className="spine-featured-overlay" />
                      <div className="spine-featured-content">
                        <span className="spine-featured-role">
                          {item.role}
                        </span>
                        <BlurText
                          text={item.title}
                          className="spine-featured-title"
                          delay={80}
                          animateBy="words"
                          direction="bottom"
                          stepDuration={0.4}
                          threshold={0.05}
                          rootMargin="0px 0px -10% 0px"
                        />
                        <BlurText
                          text={item.outcome}
                          className="spine-featured-outcome"
                          delay={60}
                          animateBy="words"
                          direction="bottom"
                          stepDuration={0.35}
                          threshold={0.05}
                          rootMargin="0px 0px -10% 0px"
                          animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 20 }}
                          animationTo={[
                            { filter: 'blur(3px)', opacity: 0.5, y: 3 },
                            { filter: 'blur(0px)', opacity: 1, y: 0 },
                          ]}
                        />
                      </div>
                    </a>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="spine-row-link"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.997 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {item.thumb && (
                        <img
                          src={item.thumb}
                          alt=""
                          className="shrink-0 rounded-md object-cover"
                          style={{ width: '48px', height: '48px' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <BlurText
                          text={item.title}
                          className="font-medium text-[var(--color-text)]"
                          delay={60}
                          animateBy="words"
                          direction="top"
                          stepDuration={0.3}
                          animationFrom={{ filter: 'blur(6px)', opacity: 0, y: -16 }}
                          animationTo={[
                            { filter: 'blur(2px)', opacity: 0.6, y: 2 },
                            { filter: 'blur(0px)', opacity: 1, y: 0 },
                          ]}
                        />
                        <BlurText
                          text={item.outcome}
                          className="type-body"
                          delay={50}
                          animateBy="words"
                          direction="top"
                          stepDuration={0.28}
                          animationFrom={{ filter: 'blur(5px)', opacity: 0, y: -12 }}
                          animationTo={[
                            { filter: 'blur(2px)', opacity: 0.5, y: 2 },
                            { filter: 'blur(0px)', opacity: 1, y: 0 },
                          ]}
                        />
                      </div>
                      <span className="type-caption">{item.role}</span>
                    </motion.a>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
