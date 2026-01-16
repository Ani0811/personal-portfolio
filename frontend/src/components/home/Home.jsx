import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HeroSection } from '../herosection/HeroSection';

export function HomeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const offset = 80;
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" ref={ref} className="relative">
      <HeroSection />
      
      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-colors z-10"
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
    </section>
  );
}
