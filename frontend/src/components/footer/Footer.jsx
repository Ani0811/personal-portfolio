import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const signatureRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });

  const NAME = 'Anirudha Basu Thakur';
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:<>/?|\\';

  useEffect(() => {
    if (!isInView || !signatureRef.current) return;

    const el = signatureRef.current;
    let cycleTimers = [];
    let isMounted = true;

    const runCycle = () => {
      if (!isMounted || !el) return;

      const letters = Array.from(NAME);
      el.innerHTML = letters.map((c) => `<span class="sig-char" aria-hidden="true">&nbsp;</span>`).join('');
      const spans = Array.from(el.querySelectorAll('.sig-char'));
      const timers = [];
      let maxEnd = 0;

      // Type animation
      spans.forEach((span, idx) => {
        const target = letters[idx];
        const startDelay = 60 * idx + Math.random() * 90;
        const scrambleDuration = 450 + Math.random() * 300;
        const endAt = startDelay + scrambleDuration;
        if (endAt > maxEnd) maxEnd = endAt;

        const start = setTimeout(() => {
          if (!isMounted) return;
          const startedAt = Date.now();
          const interval = setInterval(() => {
            if (!isMounted) {
              clearInterval(interval);
              return;
            }
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
        }, startDelay);
        timers.push(start);
      });

      // Untype animation after pause
      const untypeDelay = maxEnd + 2600;
      const untypeTimer = setTimeout(() => {
        if (!isMounted) return;
        for (let i = spans.length - 1; i >= 0; i--) {
          const s = spans[i];
          const delay = (spans.length - 1 - i) * 90;
          const t = setTimeout(() => {
            if (!isMounted) return;
            s.style.transition = 'opacity 220ms ease, transform 220ms ease';
            s.style.opacity = '0';
            s.style.transform = 'translateY(8px) scale(0.94)';
            setTimeout(() => {
              if (isMounted) s.textContent = '\u00A0';
            }, 220);
          }, delay);
          timers.push(t);
        }

        // Start next cycle after untyping completes
        const totalUntype = spans.length * 90 + 600;
        const nextCycleTimer = setTimeout(() => {
          if (isMounted) runCycle();
        }, totalUntype);
        timers.push(nextCycleTimer);
      }, untypeDelay);

      timers.push(untypeTimer);
      cycleTimers = timers;
    };

    runCycle();

    return () => {
      isMounted = false;
      cycleTimers.forEach((t) => {
        try {
          clearTimeout(t);
          clearInterval(t);
        } catch (e) {
          /* ignore */
        }
      });
    };
  }, [isInView]);

  return (
    <footer
      ref={footerRef}
      className="border-t"
      style={{
        background: 'var(--nav-footer-bg)',
        borderColor: 'var(--nav-footer-border)',
        color: 'var(--nav-footer-text)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo/Name */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                aria-label="Home"
              >
                <img src="/assets/icons/ABT_Logo.svg" alt="ABT Logo" className="w-full h-full object-cover" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground">Full-stack projects, design systems, and thoughtful code.</div>
          </div>
        </div>

        {/* Single centered row: © year • Created By: <signature> • Linktree */}
          <div className="mt-6 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-4 sm:gap-6 text-center md:text-left">
            {/* Left: copyright (Dev logo removed) */}
            <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground">© {currentYear} All rights reserved.</span>
            </div>

            {/* Center: Created By + animated signature */}
            <div className="mt-3 md:mt-0 flex flex-wrap items-center justify-center gap-2 text-center w-full md:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground align-middle">Created By:</span>
              <div
                ref={signatureRef}
                className="signature-wrap text-accent font-mono font-bold text-sm sm:text-base tracking-wider inline-flex align-middle"
                style={{
                  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))',
                  minHeight: '24px'
                }}
              />
            </div>

            {/* Right: Linktree icon */}
            <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
              <a
                href="https://linktr.ee/AnirudhaBasuThakur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 ring-1 ring-transparent"
                aria-label="Linktree"
                style={{ background: 'var(--color-accent)', boxShadow: '0 8px 28px rgba(6,182,212,0.18)' }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <g>
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="16" cy="8" r="3" />
                    <rect x="7" y="12" width="10" height="6" rx="3" />
                  </g>
                </svg>
              </a>
            </div>
          </div>
      </div>
      
      <style>{`
        .sig-char {
          display: inline-block;
          transition: all 0.15s ease;
        }
        .sig-char.settled {
          color: var(--color-accent);
        }
        .signature-wrap {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          max-width: 260px;
          line-height: 1;
        }
        @media (min-width: 640px) {
          .signature-wrap {
            max-width: none;
          }
        }
      `}</style>
    </footer>
  );
}
