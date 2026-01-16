import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeader, Card } from '../common';

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        'React.js',
        'JavaScript',
        'Tailwind CSS',
        'HTML/CSS',
        'Responsive Design',
      ],
    },
    {
      title: 'Backend & Databases',
      skills: [
        'Node.js / Express',
        'Java',
        '.NET / C#',
        'Python',
        'SQL',
        'MongoDB',
      ],
    },
    {
      title: 'Tools & Platforms',
      skills: [
        'Git / GitHub',
        'AWS',
        'Azure',
        'REST APIs',
        'Postman',
        'VS Code',
      ],
    },
  ];

  return (
    <section id="skills" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Tech Stack"
          title="Skills & Technologies"
          animate
          isInView={isInView}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card
              key={category.title}
              className="p-8 group"
              animate
              animationProps={{
                initial: { opacity: 0, y: 30 },
                animate: isInView ? { opacity: 1, y: 0 } : {},
                transition: { duration: 0.6, delay: categoryIndex * 0.1 },
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent)',
                }}
              />
              <h3 className="text-xl font-semibold mb-6 text-accent">{category.title}</h3>
              <ul className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                    }}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
                    <span>{skill}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Additional Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground italic">
            Always learning, always building. These are the tools I use to ship real products.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
