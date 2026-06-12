'use client';

import { useEffect, useRef } from 'react';

/**
 * A subtle astrological background: a twinkling starfield, slowly drifting
 * constellations, occasional shooting stars, and a faint rotating zodiac ring.
 * Sits fixed behind all content, ignores pointer events, adapts to light/dark,
 * and falls back to a calm static field when prefers-reduced-motion is set.
 */
export function CelestialBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Star { x: number; y: number; r: number; a: number; tw: number; vx: number; vy: number }
    interface Shooting { x: number; y: number; len: number; vx: number; vy: number; life: number; max: number }

    let stars: Star[] = [];
    let constellations: Star[][] = [];
    let shooting: Shooting | null = null;
    let nextShoot = 4000 + Math.random() * 5000;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      const count = Math.round((w * h) / 14000); // density
      stars = Array.from({ length: Math.min(180, Math.max(50, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.4, 1.6),
        a: rand(0.2, 1),
        tw: rand(0, Math.PI * 2),
        vx: rand(-0.04, 0.04),
        vy: rand(0.02, 0.10),
      }));

      // A few constellations: small clusters of connected stars
      constellations = Array.from({ length: 5 }, () => {
        const cx = rand(0.08, 0.92) * w;
        const cy = rand(0.08, 0.7) * h;
        const n = Math.round(rand(4, 6));
        let px = cx;
        let py = cy;
        return Array.from({ length: n }, () => {
          px += rand(-70, 70);
          py += rand(-55, 55);
          return { x: px, y: py, r: rand(1, 1.8), a: rand(0.5, 1), tw: rand(0, Math.PI * 2), vx: rand(-0.03, 0.03), vy: rand(0.01, 0.05) };
        });
      });
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    let ringAngle = 0;
    let t = 0;
    let last = performance.now();
    let raf = 0;

    function palette() {
      const dark = document.documentElement.classList.contains('dark');
      return dark
        ? { star: '255, 224, 165', line: '245, 158, 66', ring: '245, 158, 66', max: 0.95, lineA: 0.18, ringA: 0.12 }
        : { star: '226, 142, 46', line: '226, 142, 46', ring: '210, 140, 40', max: 0.55, lineA: 0.10, ringA: 0.07 };
    }

    function drawRing(cx: number, cy: number, radius: number, pal: ReturnType<typeof palette>) {
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(ringAngle);
      // outer dashed circle
      ctx!.strokeStyle = `rgba(${pal.ring}, ${pal.ringA})`;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([2, 10]);
      ctx!.beginPath();
      ctx!.arc(0, 0, radius, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);
      // inner circle
      ctx!.beginPath();
      ctx!.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${pal.ring}, ${pal.ringA * 0.7})`;
      ctx!.stroke();
      // 12 zodiac ticks
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const x1 = Math.cos(ang) * radius * 0.82;
        const y1 = Math.sin(ang) * radius * 0.82;
        const x2 = Math.cos(ang) * radius;
        const y2 = Math.sin(ang) * radius;
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.strokeStyle = `rgba(${pal.ring}, ${pal.ringA * 1.4})`;
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last);
      last = now;
      t += dt;
      const pal = palette();
      ctx!.clearRect(0, 0, w, h);

      // Rotating zodiac rings (very slow), placed off the top corners
      ringAngle += dt * 0.000035;
      drawRing(w * 0.86, h * 0.16, Math.min(w, h) * 0.28, pal);
      drawRing(w * 0.12, h * 0.82, Math.min(w, h) * 0.2, pal);

      // Constellation lines + stars
      ctx!.lineWidth = 1;
      for (const group of constellations) {
        ctx!.beginPath();
        group.forEach((s, i) => {
          if (!reduced) { s.x += s.vx; s.y += s.vy; if (s.y > h) s.y = 0; }
          if (i === 0) ctx!.moveTo(s.x, s.y);
          else ctx!.lineTo(s.x, s.y);
        });
        ctx!.strokeStyle = `rgba(${pal.line}, ${pal.lineA})`;
        ctx!.stroke();
        for (const s of group) {
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${pal.star}, ${Math.min(pal.max, s.a)})`;
          ctx!.fill();
        }
      }

      // Twinkling stars
      for (const s of stars) {
        if (!reduced) {
          s.tw += 0.02;
          s.x += s.vx;
          s.y += s.vy;
          if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
          if (s.x > w) s.x = 0; else if (s.x < 0) s.x = w;
        }
        const tw = reduced ? s.a : s.a * (0.55 + 0.45 * Math.sin(s.tw));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${pal.star}, ${Math.min(pal.max, tw)})`;
        ctx!.fill();
      }

      // Shooting star
      if (!reduced) {
        nextShoot -= dt;
        if (!shooting && nextShoot <= 0) {
          const fromLeft = Math.random() > 0.5;
          shooting = {
            x: fromLeft ? rand(0, w * 0.4) : rand(w * 0.6, w),
            y: rand(0, h * 0.4),
            len: rand(80, 160),
            vx: (fromLeft ? 1 : -1) * rand(6, 10),
            vy: rand(3, 6),
            life: 0,
            max: rand(500, 900),
          };
          nextShoot = 5000 + Math.random() * 7000;
        }
        if (shooting) {
          shooting.life += dt;
          shooting.x += shooting.vx;
          shooting.y += shooting.vy;
          const prog = shooting.life / shooting.max;
          const alpha = Math.sin(Math.PI * prog) * (pal.max);
          const tailX = shooting.x - (shooting.vx / Math.hypot(shooting.vx, shooting.vy)) * shooting.len;
          const tailY = shooting.y - (shooting.vy / Math.hypot(shooting.vx, shooting.vy)) * shooting.len;
          const grad = ctx!.createLinearGradient(shooting.x, shooting.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${pal.star}, ${alpha})`);
          grad.addColorStop(1, `rgba(${pal.star}, 0)`);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.6;
          ctx!.beginPath();
          ctx!.moveTo(shooting.x, shooting.y);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
          if (prog >= 1 || shooting.x < -200 || shooting.x > w + 200 || shooting.y > h + 200) shooting = null;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // draw a single static frame
      frame(performance.now());
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
