import { useEffect, useRef } from 'react';

const STAR_COUNT_DESKTOP = 90;
const STAR_COUNT_MOBILE = 45;
const LINK_DIST = 130;
const SPEED = 0.12;

// Shooting stars: rare, short-lived streaks across the sky.
const SHOOTING_STAR_MIN_DELAY = 3500; // ms
const SHOOTING_STAR_MAX_DELAY = 9000; // ms
const SHOOTING_STAR_DURATION = 900; // ms

export default function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let shootingStars = [];
    let rafId = null;
    let shootingStarTimeout = null;
    let mouse = { x: -9999, y: -9999 };

    const getColors = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        star: styles.getPropertyValue('--accent-dim').trim() || '#8ecae6',
        line: styles.getPropertyValue('--line').trim() || '#262B36',
      };
    };

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3
        ? h.split('').map(c => c + c).join('')
        : h, 16);
      if (Number.isNaN(bigint)) return { r: 142, g: 202, b: 230 };
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    // Draws a small 4-point "sparkle" star (like ✦) centered at (cx, cy).
    const drawStar = (cx, cy, size) => {
      const inner = size * 0.35;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.quadraticCurveTo(cx, cy, cx + size, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + size);
      ctx.quadraticCurveTo(cx, cy, cx - size, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - size);
      ctx.closePath();
      ctx.fill();
    };

    const spawnShootingStar = () => {
      // Enter from a random point along the top edge or left edge (including
      // the middle of the screen, not just the corners), travel diagonally
      // down-right at a random angle/length/speed.
      const fromTop = Math.random() < 0.6;
      const startX = fromTop ? Math.random() * width : 0;
      const startY = fromTop ? 0 : Math.random() * height * 0.7;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.5; // ~45deg diagonal
      const length = 90 + Math.random() * 110;
      const speed = length / SHOOTING_STAR_DURATION;

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        life: 0,
        duration: SHOOTING_STAR_DURATION * (0.8 + Math.random() * 0.4),
      });

      scheduleShootingStar();
    };

    const scheduleShootingStar = () => {
      const delay = SHOOTING_STAR_MIN_DELAY + Math.random() * (SHOOTING_STAR_MAX_DELAY - SHOOTING_STAR_MIN_DELAY);
      shootingStarTimeout = setTimeout(spawnShootingStar, delay);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 700 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const { star, line } = getColors();
      const starRgb = hexToRgb(star);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReduced) {
          s.x += s.vx;
          s.y += s.vy;
          s.tw += 0.02;
          if (s.x < 0) s.x = width; else if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height; else if (s.y > height) s.y = 0;
        }

        for (let j = i + 1; j < stars.length; j++) {
          const o = stars[j];
          const dx = s.x - o.x, dy = s.y - o.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const opacity = (1 - d / LINK_DIST) * 0.5;
            ctx.strokeStyle = line + Math.round(opacity * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }

        const dxm = s.x - mouse.x, dym = s.y - mouse.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < LINK_DIST) {
          const opacity = (1 - dm / LINK_DIST) * 0.7;
          ctx.strokeStyle = star + Math.round(opacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const s of stars) {
        const flicker = prefersReduced ? 1 : 0.55 + Math.sin(s.tw) * 0.45;
        ctx.fillStyle = `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, ${flicker})`;
        drawStar(s.x, s.y, s.r * 2.2);
      }

      if (!prefersReduced && shootingStars.length) {
        const frameMs = 16.6;
        shootingStars = shootingStars.filter((sh) => sh.life < sh.duration);
        for (const sh of shootingStars) {
          sh.life += frameMs;
          sh.x += sh.vx * frameMs;
          sh.y += sh.vy * frameMs;

          const progress = sh.life / sh.duration;
          const fade = progress < 0.15
            ? progress / 0.15
            : 1 - (progress - 0.15) / 0.85;
          const opacity = Math.max(0, fade);

          const tailX = sh.x - sh.vx * (sh.length / Math.hypot(sh.vx, sh.vy));
          const tailY = sh.y - sh.vy * (sh.length / Math.hypot(sh.vx, sh.vy));

          const gradient = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
          gradient.addColorStop(0, `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          drawStar(sh.x, sh.y, 3);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    if (!prefersReduced) {
      scheduleShootingStar();
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (shootingStarTimeout) clearTimeout(shootingStarTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation-bg" aria-hidden="true" />;
}
