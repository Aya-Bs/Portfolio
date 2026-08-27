import { useEffect, useRef, useState } from 'react';

/**
 * Renders an image as a "constellation": edge/feature points sampled from the
 * source image, drawn as twinkling stars connected by faint lines (like the
 * background Constellation, but shaped like the photo's silhouette).
 *
 * Usage:
 *   <PortraitConstellation src={heroImg} width={380} height={460} />
 */
export default function PortraitConstellation({
  src,
  width = 380,
  height = 460,
  pointCount = 5000,
  linkDist = 26,
  className = '',
}) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const pointsRef = useRef([]);

  // --- Step 1: load image, sample edge points once ---
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;

      // Work at a modest sampling resolution for performance.
      const sampleW = 160;
      const sampleH = Math.round((img.naturalHeight / img.naturalWidth) * sampleW) || 160;

      const off = document.createElement('canvas');
      off.width = sampleW;
      off.height = sampleH;
      const octx = off.getContext('2d');
      octx.drawImage(img, 0, 0, sampleW, sampleH);

      let data;
      try {
        data = octx.getImageData(0, 0, sampleW, sampleH).data;
      } catch (e) {
        // CORS-tainted canvas (e.g. remote image without proper headers) — bail out.
        return;
      }

      // Grayscale luminance buffer
      const gray = new Float32Array(sampleW * sampleH);
      for (let i = 0; i < sampleW * sampleH; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }

      // Sobel edge magnitude
      const mag = new Float32Array(sampleW * sampleH);
      let maxMag = 1;
      for (let y = 1; y < sampleH - 1; y++) {
        for (let x = 1; x < sampleW - 1; x++) {
          const i = y * sampleW + x;
          const gx =
            -gray[i - sampleW - 1] + gray[i - sampleW + 1] +
            -2 * gray[i - 1] + 2 * gray[i + 1] +
            -gray[i + sampleW - 1] + gray[i + sampleW + 1];
          const gy =
            -gray[i - sampleW - 1] - 2 * gray[i - sampleW] - gray[i - sampleW + 1] +
            gray[i + sampleW - 1] + 2 * gray[i + sampleW] + gray[i + sampleW + 1];
          const m = Math.sqrt(gx * gx + gy * gy);
          mag[i] = m;
          if (m > maxMag) maxMag = m;
        }
      }

      // Collect candidate edge points above a relative threshold
      const threshold = maxMag * 0.22;
      const candidates = [];
      for (let y = 1; y < sampleH - 1; y++) {
        for (let x = 1; x < sampleW - 1; x++) {
          const i = y * sampleW + x;
          if (mag[i] > threshold) {
            candidates.push({ x, y, strength: mag[i] });
          }
        }
      }

      // Sort strongest first, then greedily keep points that are spaced apart
      // (min-distance sampling) until we hit pointCount.
      candidates.sort((a, b) => b.strength - a.strength);
      const minDist = Math.max(1.4, Math.sqrt((sampleW * sampleH) / (pointCount * 3)));
      const kept = [];
      for (const c of candidates) {
        if (kept.length >= pointCount) break;
        let ok = true;
        for (let k = 0; k < kept.length; k++) {
          const dx = kept[k].x - c.x, dy = kept[k].y - c.y;
          if (dx * dx + dy * dy < minDist * minDist) { ok = false; break; }
        }
        if (ok) kept.push(c);
      }

      // Normalize to 0..1 so we can scale to any render size later
      pointsRef.current = kept.map(p => ({
        nx: p.x / sampleW,
        ny: p.y / sampleH,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.015 + Math.random() * 0.02,
      }));

      if (!cancelled) setReady(true);
    };
    img.src = src;

    return () => { cancelled = true; };
  }, [src, pointCount]);

  // --- Step 2: animate on a visible canvas ---
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = null;

    const getColors = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        star: styles.getPropertyValue('--accent').trim() || '#8ecae6',
        line: styles.getPropertyValue('--accent-dim').trim() || '#8ecae6',
      };
    };

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
      const bigint = parseInt(full, 16);
      if (Number.isNaN(bigint)) return { r: 162, g: 210, b: 255 };
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const points = pointsRef.current.map(p => ({
      ...p,
      x: p.nx * width,
      y: p.ny * height,
    }));

    const draw = () => {
      const { star, line } = getColors();
      const starRgb = hexToRgb(star);
      const lineRgb = hexToRgb(line);
      ctx.clearRect(0, 0, width, height);

      // connecting lines between nearby points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const o = points[j];
          const dx = p.x - o.x, dy = p.y - o.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const opacity = (1 - d / linkDist) * 0.55;
            ctx.strokeStyle = `rgba(${lineRgb.r}, ${lineRgb.g}, ${lineRgb.b}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        }
      }

      // stars
      for (const p of points) {
        if (!prefersReduced) p.tw += p.twSpeed;
        const flicker = prefersReduced ? 1 : 0.5 + Math.sin(p.tw) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, ${0.4 + flicker * 0.6})`;
        ctx.arc(p.x, p.y, 1.3 + flicker * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [ready, width, height, linkDist]);

  return (
    <canvas
      ref={canvasRef}
      className={`portrait-constellation ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
