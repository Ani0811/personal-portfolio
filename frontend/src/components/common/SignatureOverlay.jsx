import { useEffect, useRef, useState } from 'react';

export default function SignatureOverlay() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const overlayRef = useRef(null);

  const NAME = 'Anirudha Basu Thakur';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:<>/?|\\';

  // only show on home; positions are fixed top-left and bottom-right
  const isHome = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html'));

  useEffect(() => {
    if (!isHome) return;

    // initialize signature for both refs (top and bottom) if present
    const initFor = (el) => {
      if (!el) return [];
      const letters = Array.from(NAME);
      el.innerHTML = letters.map((c) => `<span class="sig-char" aria-hidden="true">&nbsp;</span>`).join('');
      const spans = Array.from(el.querySelectorAll('.sig-char'));
      const timers = [];
      let maxEnd = 0;

      spans.forEach((span, idx) => {
        const target = letters[idx];
        const startDelay = 60 * idx + Math.random() * 90; // stagger with slight jitter (ms)
        const scrambleDuration = 450 + Math.random() * 300; // ms

        const endAt = startDelay + scrambleDuration;
        if (endAt > maxEnd) maxEnd = endAt;

        const start = setTimeout(() => {
          const startedAt = Date.now();
          const interval = setInterval(() => {
            const t = Date.now() - startedAt;
            if (t >= scrambleDuration) {
              span.textContent = target === ' ' ? '\u00A0' : target;
              span.classList.add('settled');
              clearInterval(interval);
              return;
            }
            span.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
          }, 28 + Math.random() * 36);
          timers.push(interval);
        }, startDelay + Math.random() * 30);

        timers.push(start);
      });

      // schedule an "untype" animation: remove characters in reverse after a pause
      const untypeDelay = maxEnd + 260 + 2400; // wait a bit after settle
      const untypeTimers = [];
      const performUntype = () => {
        for (let i = spans.length - 1; i >= 0; i--) {
          const s = spans[i];
          const delay = (spans.length - 1 - i) * 90;
          const t = setTimeout(() => {
            try {
              s.style.transition = 'opacity 220ms ease, transform 220ms ease';
              s.style.opacity = '0';
              s.style.transform = 'translateY(8px) scale(0.94)';
              setTimeout(() => {
                s.textContent = '\u00A0';
                s.style.opacity = '0';
              }, 220);
            } catch (e) {}
          }, delay);
          untypeTimers.push(t);
        }

        // hide the whole element shortly after untyping completes
        const totalUntype = (spans.length) * 90 + 260;
        const hideTimer = setTimeout(() => {
          try { el.style.display = 'none'; } catch (e) {}
        }, totalUntype + 180);
        untypeTimers.push(hideTimer);
      };

      const scheduleUntype = setTimeout(performUntype, untypeDelay);
      timers.push(scheduleUntype, ...untypeTimers);

      return timers;
    };
    const timers = [];
    timers.push(...initFor(topRef.current));
    timers.push(...initFor(bottomRef.current));

    return () => {
      timers.forEach((t) => {
        try {
          clearTimeout(t);
          clearInterval(t);
        } catch (e) {
          /* ignore */
        }
      });
    };
  }, [isHome]);

  // glitter particle follower: spawn small techy neon sparks on mousemove
  useEffect(() => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9998';
    document.body.appendChild(container);
    overlayRef.current = container;

    // blue-focused palette to match site theme
    const colors = ['#AEE7FF', '#61DAFB', '#3AA7FF', '#0EA5E9', '#1B6FF0'];
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function spawnParticle(x, y) {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 12;
      p.style.position = 'fixed';
      p.style.left = `${x - size / 2}px`;
      p.style.top = `${y - size / 2}px`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.borderRadius = '50%';
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = color;
      p.style.boxShadow = `0 0 ${4 + Math.random() * 10}px ${color}, 0 0 ${12 + Math.random() * 24}px ${color}`;
      p.style.opacity = '0.95';
      p.style.transform = `translateY(0) scale(${0.8 + Math.random() * 0.6})`;
      p.style.willChange = 'transform, opacity';

      if (prefersReduced) {
        p.style.transition = 'opacity 300ms linear';
      } else {
        const t = 700 + Math.random() * 700;
        p.style.transition = `transform ${t}ms cubic-bezier(.2,.8,.2,1), opacity ${t}ms linear`;
      }

      container.appendChild(p);

      // animate a frame later to trigger transition
      requestAnimationFrame(() => {
        const dy = -(20 + Math.random() * 60);
        const rot = (Math.random() - 0.5) * 60;
        p.style.opacity = '0';
        p.style.transform = `translateY(${dy}px) scale(${1.05 + Math.random() * 0.6}) rotate(${rot}deg)`;
      });

      const life = prefersReduced ? 350 : 900 + Math.random() * 800;
      const removal = setTimeout(() => {
        try { container.removeChild(p); } catch (e) {}
        clearTimeout(removal);
      }, life);
    }

    let last = 0;
    function onMove(e) {
      const now = performance.now();
      // throttle spawn rate
      if (now - last > 18) {
        last = now;
        spawnParticle(e.clientX, e.clientY);
        // occasional micro-sparks for density
        if (Math.random() < 0.38 && !prefersReduced) {
          spawnParticle(e.clientX + (Math.random() - 0.5) * 18, e.clientY + (Math.random() - 0.5) * 18);
        }
      }
    }

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      try { document.body.removeChild(container); } catch (e) {}
    };
  }, []);

  // only render on home
  if (!isHome) return null;

  return (
    <>
      <div style={{ position: 'fixed', left: '4%', top: '6%', zIndex: 9999, pointerEvents: 'none' }}>
        <style>{`
        .robotic-signature {
          width: 320px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: var(--color-accent, #39ff14);
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          font-size: clamp(12px, 2.2vw, 18px);
          letter-spacing: 0.06em;
          filter: drop-shadow(0 1px 6px rgba(0,0,0,0.18));
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          white-space: nowrap;
          position: relative;
          /* neon glow */
          color: var(--color-accent, #39ff14);
          text-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 0 6px rgba(57,255,20,0.12);
        }

        .sig-char {
          display: inline-block;
          min-width: 0.45ch;
          text-align: center;
          opacity: 0.92;
          transform-origin: center;
          transform: translateY(6px) rotate(-2deg) scale(0.99);
          transition: transform 260ms cubic-bezier(.2,.9,.3,1), opacity 200ms ease;
        }

        .sig-char.settled {
          transform: translateY(0) rotate(0) scale(1);
          opacity: 1;
        }

        /* subtle jitter/flicker */
        @keyframes flicker {
          0% { opacity: 1; transform: translateY(0); }
          12% { opacity: 0.94; transform: translateY(-0.6px); }
          24% { opacity: 1; transform: translateY(0); }
          36% { opacity: 0.96; transform: translateY(0.4px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .robotic-signature { animation: flicker 4s infinite steps(8,end), float 2.8s ease-in-out infinite; }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        /* scanline overlay */
        .robotic-signature::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0) 100%);
          background-size: 100% 2px;
          pointer-events: none;
          mix-blend-mode: overlay;
          opacity: 0.12;
        }

        /* slow horizontal scan */
        @keyframes scan {
          0% { transform: translateX(-120%); opacity: 0; }
          45% { transform: translateX(-10%); opacity: 0.12; }
          55% { transform: translateX(10%); opacity: 0.06; }
          100% { transform: translateX(120%); opacity: 0; }
        }

        .robotic-signature::before {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          animation: scan 7.5s linear infinite;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* fade-out once finished */
        .robotic-signature.finished { opacity: 0; transform: translateY(6px); transition: opacity 900ms ease, transform 700ms ease; }
        `}</style>
        <div className="robotic-signature" ref={topRef} aria-hidden="true" />
      </div>

      <div style={{ position: 'fixed', right: '4%', bottom: '6%', zIndex: 9999, pointerEvents: 'none' }}>
        <div className="robotic-signature" ref={bottomRef} aria-hidden="true" />
      </div>
    </>
  );
}
