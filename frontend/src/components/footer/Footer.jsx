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
      className="relative border-t"
      style={{
        background: 'linear-gradient(to bottom, var(--nav-footer-bg), #030711)',
        borderColor: 'var(--nav-footer-border)',
        color: 'var(--nav-footer-text)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
        marginTop: '4rem'
      }}
    >
      {/* Subtle top gradient for separation */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
        }}
      />
      
      <div className="w-full mx-auto px-12 lg:px-24 py-12 sm:py-16" style={{ minHeight: '260px' }}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
          
          {/* Column 1: Brand & About */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-9 h-9 rounded-full overflow-hidden bg-white/5 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 hover:bg-white/10 transition-colors"
                aria-label="Home"
              >
                <img src="/assets/icons/ABT_Logo.svg" alt="ABT Logo" className="w-full h-full object-cover" />
              </button>
              <span className="text-base font-bold">Anirudha</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-xs mx-auto md:mx-0">
              Full-stack developer crafting modern web experiences with clean code and thoughtful design.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Kolkata, India</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Quick Links
            </h3>
            <ul className="space-y-1.5">
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
                    className="text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social & Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Connect
            </h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://github.com/Ani0811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Ani0811
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/anirudha-basu-thakur-686aa8253/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Anirudha Basu Thakur
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/this_is_ringo_here"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  this_is_ringo_here
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=anirudha.basuthakur@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Tech Stack Highlights */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>
              Built With
            </h3>
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mb-3">
              {['React', 'Node.js', 'MySQL', 'Tailwind'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs rounded bg-white/5 text-muted-foreground border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Open to jobs, freelance projects and collaboration opportunities.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Signature */}
        <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-10 sm:gap-3 text-center sm:text-left">
            {/* Left: Copyright */}
            <div className="text-xs text-muted-foreground order-2 sm:order-1">
              © {currentYear} Anirudha Basu Thakur. All rights reserved.
            </div>

            {/* Center: Animated Signature */}
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <span className="text-xs text-muted-foreground">Crafted by:</span>
              <div
                ref={signatureRef}
                className="signature-wrap text-accent font-mono font-bold text-xs tracking-wider inline-flex"
                style={{
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                  minHeight: '16px'
                }}
              />
            </div>
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
