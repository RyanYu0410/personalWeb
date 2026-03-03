import { useEffect, useRef } from 'react';

export default function HorizontalBlackFire() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 120;
    };
    
    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;

      constructor(canvasEl: HTMLCanvasElement) {
        this.x = 0;
        this.y = Math.random() * canvasEl.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 2.5 + 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.maxLife = Math.random() * 0.4 + 0.6;
        this.life = this.maxLife;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          const force = (80 - distance) / 80;
          this.speedX -= (dx / distance) * force * 0.3;
          this.speedY -= (dy / distance) * force * 0.25;
        }

        this.speedX += 0.02;
        this.x += this.speedX;
        this.y += this.speedY;

        this.life -= 0.006;
        this.size = Math.max(0.3, this.size * 0.98);
      }

      draw() {
        if (!ctx) return;
        const t = this.life / this.maxLife;
        const alpha = t * t * 0.35; // ease-out fade
        const r = 31;
        const g = 35;
        const b = 41;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        gradient.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new particles (left edge)
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(canvas));
      }
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Remove dead particles
      particles = particles.filter((p) => p.life > 0 && p.x < canvas.width && p.size > 0);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mb-[var(--space-lg)]" style={{ height: '120px' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair', borderRadius: '8px' }}
      />
    </div>
  );
}
