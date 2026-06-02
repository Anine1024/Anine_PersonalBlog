import { useRef, useEffect } from 'react';

interface Beam {
  x: number;
  width: number;
  speed: number;
  alpha: number;
  phase: number;
}

function getColors(isDark: boolean) {
  return {
    beam: isDark
      ? (alpha: number) => `rgba(59, 130, 246, ${alpha.toFixed(3)})`
      : (alpha: number) => `rgba(59, 130, 246, ${(alpha * 0.5).toFixed(3)})`,
  };
}

export function LightBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const themeRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    function isDark() {
      return !document.documentElement.classList.contains('light');
    }

    function initBeams(width: number) {
      const beams: Beam[] = [];
      for (let i = 0; i < 5; i++) {
        beams.push({
          x: Math.random() * width,
          width: 200 + Math.random() * 300,
          speed: 0.15 + Math.random() * 0.25,
          alpha: 0.04 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
        });
      }
      beamsRef.current = beams;
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initBeams(canvas!.width);
    }

    resize();
    window.addEventListener('resize', resize);

    const observer = new MutationObserver(() => {
      themeRef.current = isDark();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    themeRef.current = isDark();

    function draw(timestamp: number) {
      const colors = getColors(themeRef.current);
      const w = canvas!.width;
      const h = canvas!.height;

      ctx!.clearRect(0, 0, w, h);

      const t = timestamp * 0.001;

      for (const beam of beamsRef.current) {
        // Gentle horizontal drift
        const bx = beam.x + Math.sin(t * beam.speed + beam.phase) * 60;
        const flicker = 0.7 + 0.3 * Math.sin(t * 0.8 + beam.phase);

        const gradient = ctx!.createLinearGradient(bx - beam.width / 2, 0, bx + beam.width / 2, 0);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(0.3, colors.beam(beam.alpha * flicker * 0.5));
        gradient.addColorStop(0.5, colors.beam(beam.alpha * flicker));
        gradient.addColorStop(0.7, colors.beam(beam.alpha * flicker * 0.5));
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{ zIndex: 1, height: '100vh', filter: 'blur(30px)' }}
    />
  );
}
