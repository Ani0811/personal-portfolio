import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button, Badge } from '../common';
import { useTheme } from '../themes/ThemeProvider';
import AbstractSystemHalo from './AbstractSystemHalo';

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { theme } = useTheme();
  const tiltRef = useRef(null);
  const rafRef = useRef(null);
  const badgeRef = useRef(null);
  const badgeRafRef = useRef(null);
  const motionAllowed = typeof window !== 'undefined' ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true;
  const touchDevice = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
  const interactiveAllowed = motionAllowed && !touchDevice;

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!interactiveAllowed || !tiltRef.current) return;

    const el = tiltRef.current;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const maxRot = 8; // degrees
    const handleMove = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width; // 0..1
      const y = (clientY - rect.top) / rect.height; // 0..1
      // normalize to -1 .. 1
      const nx = (x - 0.5) * 2;
      const ny = (y - 0.5) * 2;
      targetY = nx * maxRot; // yaw
      targetX = -ny * maxRot; // pitch
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchend', onLeave);

    const step = () => {
      // ease towards target
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      // apply rotation to container
      el.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      // subtle parallax offset for inner elements via CSS variable
      el.style.setProperty('--tilt-x', `${currentX}`);
      el.style.setProperty('--tilt-y', `${currentY}`);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchend', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tiltRef.current) tiltRef.current.style.transform = '';
    };
  }, [motionAllowed]);

  useEffect(() => {
    if (!interactiveAllowed || !badgeRef.current) return;

    const el = badgeRef.current;
    // ensure browser optimizations
    el.style.willChange = 'transform';
    el.style.transformOrigin = '50% 50%';

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const maxRot = 5; // stronger rotation for desktop visibility
    let startTime = 0;

    const handleMove = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const nx = (x - 0.5) * 2;
      const ny = (y - 0.5) * 2;
      targetY = nx * maxRot;
      targetX = -ny * maxRot;
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchend', onLeave);

    const step = (time) => {
      if (!startTime) startTime = time;
      const t = (time - startTime) / 1000;
      // more noticeable auto-sway for desktop
      const autoX = Math.sin(t * 0.9) * 1.0;
      const autoY = Math.cos(t * 0.7) * 1.0;
      const desiredX = targetX + autoX * 0.45;
      const desiredY = targetY + autoY * 0.45;
      currentX += (desiredX - currentX) * 0.08;
      currentY += (desiredY - currentY) * 0.08;
      el.style.transform = `perspective(900px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      // update child depths to create pronounced Z-axis motion
      try {
        const children = Array.from(el.querySelectorAll(':scope > span'));
        const depthFactor = (Math.abs(currentX) + Math.abs(currentY)) / 2; // degrees -> depth influence
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const base = Number(child.dataset.depth) || 0;
          const extra = depthFactor * 6; // scale to pixels for visible effect
          // small translationY based on layer to accentuate parallax
          const layerShift = (i - (children.length - 1) / 2) * 2;
          child.style.transform = `translateZ(${base + extra}px) translateY(${layerShift}px)`;
        }
      } catch (e) {
        // querySelectorAll may not be supported in older environments; ignore
      }
      badgeRafRef.current = requestAnimationFrame(step);
    };

    badgeRafRef.current = requestAnimationFrame(step);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchend', onLeave);
      if (badgeRafRef.current) cancelAnimationFrame(badgeRafRef.current);
      if (badgeRef.current) {
        badgeRef.current.style.transform = '';
        badgeRef.current.style.willChange = '';
      }
    };
  }, [motionAllowed]);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Distributed System Visualization */}
      <AbstractSystemHalo theme={theme} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 mt-12 sm:mt-0 flex items-center justify-center gap-3"
          >
            <div
              ref={badgeRef}
              className="hero-badges inline-flex flex-wrap justify-center gap-3 max-w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span data-depth="18" className="inline-block" style={{ transition: 'transform 220ms ease' }}>
                <Badge variant="outline" size="lg" className="border-2 text-accent bg-transparent text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2">
                  Junior Software Developer
                </Badge>
              </span>
              <span data-depth="30" className="inline-block" style={{ transition: 'transform 260ms ease' }}>
                <Badge variant="outline" size="lg" className="border-2 text-accent bg-transparent text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2">
                  Full-Stack Developer
                </Badge>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-3d"
          >
            <div
              ref={tiltRef}
              className="hero-heading inline-block origin-center"
              style={{
                transformStyle: 'preserve-3d',
                transition: interactiveAllowed ? 'none' : 'transform 300ms ease',
                willChange: interactiveAllowed ? 'transform' : 'auto',
              }}
            >
              <span style={{ display: 'block', transform: 'translateZ(12px)' }}>Building Digital</span>
              <span style={{ display: 'block', transform: 'translateZ(36px)', fontWeight: 800 }} className="highlight emphasis">Experiences</span>
              <span style={{ display: 'block', transform: 'translateZ(10px)' }}>That Scale</span>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}
          >
            BCA graduate with hands-on experience in full-stack development, including .NET, Java frameworks, Python frameworks, and modern JavaScript technologies. Passionate about delivering end-to-end solutions with strong problem-solving skills and attention to detail.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="contact"
              size="lg"
              className="shadow-lg shadow-accent/20"
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  const offset = 80;
                  const elementPosition = projectsSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - offset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
            >
              View Projects
            </Button>
            <Button
              variant="secondary"
              size="lg"
              animate
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const offset = 80;
                  const elementPosition = contactSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - offset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
            >
              Get In Touch
            </Button>
          </motion.div>

          {/* Scroll Indicator - centered under action buttons */}
          <motion.button
            onClick={() => scrollToId('about')}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 mx-auto inline-flex transition-colors z-10"
            aria-label="Scroll to about"
            style={{
              color: 'var(--color-muted-foreground)',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              padding: '0.45rem',
              borderRadius: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-accent-foreground)';
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.color = 'var(--color-accent-foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-muted-foreground)';
              e.currentTarget.style.backgroundColor = 'var(--color-card)';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.color = 'var(--color-muted-foreground)';
            }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'inherit' }}>
                <path d="M12 16.5l-8-8 1.4-1.4L12 13.7l6.6-6.6L20 8.5z" />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}