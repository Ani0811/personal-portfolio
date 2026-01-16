import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button, Badge } from '../common';

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Overlay (particles now global) */}
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
            className="mb-6 flex items-center justify-center gap-3"
          >
            <Badge variant="outline" size="lg" className="border-2 text-accent bg-transparent">
              Junior Software Developer
            </Badge>
            <Badge variant="outline" size="lg" className="border-2 text-accent bg-transparent">
              Full-Stack Developer
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            Building Digital
            <br />
            <span className="highlight emphasis">Experiences</span> That Scale
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
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
        </motion.div>
      </div>
    </div>
  );
}