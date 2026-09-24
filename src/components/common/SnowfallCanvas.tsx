import React, { useEffect, useRef } from 'react';

interface SnowfallCanvasProps {
  density?: number;
  speed?: number;
  interactive?: boolean;
}

interface Flake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swayAmplitude: number;
  swayPhase: number;
}

export const SnowfallCanvas: React.FC<SnowfallCanvasProps> = ({
  density = 36,
  speed = 0.6,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Generate snow particles with realistic physics properties
    const flakes: Flake[] = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: (Math.random() * 0.7 + 0.3) * speed,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.45 + 0.25,
      swayAmplitude: Math.random() * 0.8 + 0.4,
      swayPhase: Math.random() * Math.PI * 2
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speedY;
        f.swayPhase += 0.015;
        f.x += Math.sin(f.swayPhase) * f.swayAmplitude * 0.4 + f.speedX;

        // Subtle fluid mouse dispersion (Awwwards / React-bits inspired interactive microphysics)
        if (interactive) {
          const dx = f.x - mouseRef.current.x;
          const dy = f.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const push = ((100 - dist) / 100) * 0.9;
            f.x += (dx / dist) * push;
            f.y += (dy / dist) * push * 0.4;
          }
        }

        // Wrap around boundaries smoothly
        if (f.y > height + 10) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        // Render delicate ice crystalline particle with faint radial glow
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${f.opacity})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = f.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [density, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 opacity-70"
    />
  );
};
