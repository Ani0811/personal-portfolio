import { useEffect } from 'react';

export default function GlitterOverlay({ intensity = 1 }) {
  useEffect(() => {
    const host = document.body;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.zIndex = '5';
    host.appendChild(container);

    const colors = ['#AEE7FF', '#61DAFB', '#3AA7FF', '#0EA5E9', '#1B6FF0'];
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function spawnParticle(x, y) {
      const isSpark = !prefersReduced && Math.random() < 0.12 * intensity;
      const size = isSpark ? 14 + Math.random() * 28 : 6 + Math.random() * 14;
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.left = `${x - size / 2}px`;
      p.style.top = `${y - size / 2}px`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.borderRadius = isSpark ? '30%' : '50%';
      const color = colors[Math.floor(Math.random() * colors.length)];

      if (isSpark) {
        p.style.background = `radial-gradient(circle at 35% 35%, ${color} 0%, rgba(255,255,255,0.7) 30%, transparent 60%)`;
        p.style.boxShadow = `0 0 ${12 + Math.random() * 28}px ${color}`;
        p.style.filter = 'blur(1.5px) saturate(120%)';
        p.style.opacity = '1';
      } else {
        p.style.background = color;
        p.style.boxShadow = `0 0 ${6 + Math.random() * 12}px ${color}`;
        p.style.filter = 'blur(0.6px)';
        p.style.opacity = '0.98';
      }

      p.style.transform = `translateY(0) scale(${0.95 + Math.random() * 0.5})`;
      p.style.willChange = 'transform, opacity';

      if (prefersReduced) {
        p.style.transition = 'opacity 300ms linear';
      } else {
        const t = isSpark ? 900 + Math.random() * 800 : 500 + Math.random() * 600;
        p.style.transition = `transform ${t}ms cubic-bezier(.2,.8,.2,1), opacity ${t}ms linear`;
      }

      container.appendChild(p);
      requestAnimationFrame(() => {
        const dy = isSpark ? -(36 + Math.random() * 48) : -(18 + Math.random() * 36);
        const rot = (Math.random() - 0.5) * 60;
        p.style.opacity = '0';
        p.style.transform = `translateY(${dy}px) scale(${1.05 + Math.random() * 0.4}) rotate(${rot}deg)`;
      });

      const life = prefersReduced ? 450 : (isSpark ? 1200 + Math.random() * 800 : 900 + Math.random() * 800);
      const removal = setTimeout(() => {
        try { container.removeChild(p); } catch (e) {}
        clearTimeout(removal);
      }, life);
    }

    let last = 0;
    function onMove(e) {
      const now = performance.now();
      if (now - last > 14) {
        last = now;
        const cx = e.clientX;
        const cy = e.clientY;
        spawnParticle(cx, cy);
        if (Math.random() < 0.6 * intensity && !prefersReduced) spawnParticle(cx + (Math.random() - 0.5) * 36, cy + (Math.random() - 0.5) * 36);
        if (Math.random() < 0.35 * intensity && !prefersReduced) spawnParticle(cx + (Math.random() - 0.5) * 64, cy + (Math.random() - 0.5) * 64);
      }
    }

    // Also spawn subtle idle particles occasionally to keep the site feeling alive
    let idleTimer = null;
    function idleSpawn() {
      if (prefersReduced) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = Math.random() * w;
      const y = Math.random() * h * 0.6; // mostly upper area
      spawnParticle(x, y);
      idleTimer = setTimeout(idleSpawn, 400 + Math.random() * (1200 / Math.max(0.25, intensity)));
    }

    window.addEventListener('mousemove', onMove);
    if (!prefersReduced) idleTimer = setTimeout(idleSpawn, 800 + Math.random() * 1200);

    return () => {
      window.removeEventListener('mousemove', onMove);
      try { clearTimeout(idleTimer); } catch (e) {}
      try { host.removeChild(container); } catch (e) {}
    };
  }, [intensity]);

  return null;
}
