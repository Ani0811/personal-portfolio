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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & About */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 hover:bg-white/10 transition-colors"
                aria-label="Home"
              >
                <img src="/assets/icons/ABT_Logo.svg" alt="ABT Logo" className="w-full h-full object-cover" />
              </button>
              <span className="text-lg font-bold">Anirudha</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Full-stack developer crafting modern web experiences with clean code and thoughtful design.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>India</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About', id: 'about' },
                { label: 'Projects', id: 'projects' },
                { label: 'Skills', id: 'skills' },
                { label: 'Certifications', id: 'certifications' },
                { label: 'Contact', id: 'contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social & Links */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/anirudhabasuthakur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/anirudha-basu-thakur/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://linktr.ee/AnirudhaBasuThakur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="8" cy="8" r="2.5" />
                    <circle cx="16" cy="8" r="2.5" />
                    <rect x="7.5" y="12" width="9" height="5" rx="2.5" />
                  </svg>
                  Linktree
                </a>
              </li>
              <li>
                <a
                  href="mailto:anirudha.basuthakur@gmail.com"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Tech Stack Highlights */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>
              Built With
            </h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {['React', 'Node.js', 'MySQL', 'Tailwind'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-md bg-white/5 text-muted-foreground border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Open to freelance projects and collaboration opportunities.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Signature */}
        <div className="pt-8 border-t" style={{ borderColor: 'var(--nav-footer-border)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Copyright */}
            <div className="text-xs sm:text-sm text-muted-foreground">
              © {currentYear} Anirudha Basu Thakur. All rights reserved.
            </div>

            {/* Center: Animated Signature */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Crafted by:</span>
              <div
                ref={signatureRef}
                className="signature-wrap text-accent font-mono font-bold text-sm tracking-wider inline-flex"
                style={{
                  filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))',
                  minHeight: '20px'
                }}
              />
            </div>

            {/* Right: Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1 group"
            >
              Back to Top
              <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
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
