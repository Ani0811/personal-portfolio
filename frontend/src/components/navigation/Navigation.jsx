import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../themes/ThemeToggle';
import { Button } from '../common';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export function Navigation({ activeSection, onMobileMenuChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (onMobileMenuChange) {
      onMobileMenuChange(mobileMenuOpen);
    }
  }, [mobileMenuOpen, onMobileMenuChange]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        style={{
          background: 'var(--nav-footer-bg)',
          borderBottom: `1px solid var(--nav-footer-border)`,
          color: 'var(--nav-footer-text)',
          boxShadow: '0 6px 20px rgba(2,6,23,0.28)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <motion.button
              type="button"
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 text-lg sm:text-xl font-semibold tracking-tight hover:text-accent transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                <img
                  src="/assets/icons/ABT_Logo.svg"
                  alt="ABT Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="sr-only">Home</span>
            </motion.button>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="nav-link relative tracking-wide text-sm text-muted-foreground hover:text-foreground transition-all duration-200 group p-0"
                  aria-current={activeSection === item.id ? 'true' : undefined}
                >
                  {item.label}
                  <span
                    className={`nav-underline absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Button>
              ))}
            </div>

            {/* Right side - Theme Toggle and CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <Button variant="contact" onClick={() => scrollToSection('contact')}>
                Contact
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-foreground"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Fullscreen Mobile Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 lg:hidden"
              style={{ background: 'var(--nav-footer-bg)', color: 'var(--nav-footer-text)' }}
            >
              <div className="flex flex-col h-full p-6 overflow-auto">
                  <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          scrollToSection('home');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-left"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                          <img src="/assets/icons/ABT_Logo.svg" alt="ABT Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="sr-only">Home</span>
                      </button>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                    style={{ background: 'transparent', color: 'var(--nav-footer-text)', border: 'none' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(item.id)}
                      style={{
                        background: activeSection === item.id ? 'var(--color-accent-foreground)' : 'transparent',
                        color: activeSection === item.id ? 'var(--color-accent)' : 'var(--color-muted-foreground)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      className={`text-left px-4 py-3 rounded-lg transition-colors hover:bg-accent/5 hover:text-foreground`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                <Button
                  variant="contact"
                  className="mt-6 w-full"
                  onClick={() => scrollToSection('contact')}
                >
                  Contact Me
                </Button>

                {/* Decorative info section */}
                <div className="mt-auto pt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Kolkata, India</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Open to jobs, freelance projects<br />and collaboration opportunities
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {['React', 'Node.js', 'MySQL', 'Tailwind'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-muted-foreground border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}