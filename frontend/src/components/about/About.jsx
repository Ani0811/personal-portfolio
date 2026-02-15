import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Layers, Rocket } from 'lucide-react';
import { SectionHeader, FeatureCard, Button } from '../common';
import { useTheme } from '../themes/ThemeProvider';


export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'End-to-End Development',
      description: 'From database design to user interface, I build complete solutions.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Modern Tech Stack',
      description: 'Leveraging cutting-edge tools and frameworks for optimal performance.',
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Production-Ready',
      description: 'Clean, scalable code that ships on time and performs under pressure.',
    },
  ];

  return (
    <section id="about" ref={ref} className="relative py-20 lg:py-32 bg-card/30 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="About Me"
          title="Building With Purpose"
          animate
          isInView={isInView}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm a <span className="emphasis">BCA graduate</span> with hands-on experience in
                full-stack development, including <span className="emphasis">
                <span className="primary-highlight">.NET</span>, Java frameworks, Python frameworks,
                SQL, MongoDB, <span className="highlight">Node.js</span>, <span className="highlight">React.js</span>, and Express</span>.
                I've completed multiple freelance and evaluation projects that demonstrate my problem-solving skills and attention to detail.
              </p>
              <p>
                My approach focuses on delivering <span className="emphasis">end-to-end solutions</span> that 
                combine functionality with seamless user experience. From database design to responsive frontends, I build 
                applications that are both scalable and maintainable.
              </p>
              <p>
                Currently seeking opportunities as a <span className="highlight">Junior Software Developer</span> where 
                I can contribute to a dynamic team, continue learning, and grow alongside innovative projects.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-6 hover:scale-105 transition-transform"
                href="/Anirudha_Basu_Thakur_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                animate
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                }
              >
                View My Resume
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                animate
                animationProps={{
                  initial: { opacity: 0, y: 20 },
                  animate: isInView ? { opacity: 1, y: 0 } : {},
                  transition: { duration: 0.5, delay: 0.4 + index * 0.1 },
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
