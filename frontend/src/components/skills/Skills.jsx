import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeader, Card } from '../common';
import * as SiIcons from 'react-icons/si';

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', icon: 'SiPython' },
        { name: 'JavaScript (ES6+)', icon: 'SiJavascript' },
        { name: 'Java', icon: 'SiJava' },
        { name: 'C#', icon: 'SiCsharp' },
        { name: 'C++', icon: 'SiCplusplus' },
        { name: 'PHP', icon: 'SiPhp' },
        { name: 'SQL', icon: 'SiMysql' },
      ],
    },
    {
      title: 'Frontend Development',
      skills: [
        { name: 'React.js', icon: 'SiReact' },
        { name: 'Next.js', icon: 'SiNextdotjs' },
        { name: 'TailwindCSS', icon: 'SiTailwindcss' },
        { name: 'HTML/CSS', icon: 'SiHtml5' },
      ],
    },
    {
      title: 'Backend & Frameworks',
      skills: [
        { name: 'Node.js', icon: 'SiNodedotjs' },
        { name: 'Express.js', icon: 'SiExpress' },
        { name: '.NET', icon: 'SiDotnet' },
        { name: 'Spring Boot', icon: 'SiSpring' },
        { name: 'Django', icon: 'SiDjango' },
        { name: 'Java Server Pages (JSP)', icon: 'SiJava' },
      ],
    },
    {
      title: 'Databases',
      skills: [
        { name: 'MongoDB', icon: 'SiMongodb' },
        { name: 'MongoDB Atlas', icon: 'SiMongodb' },
        { name: 'MySQL', icon: 'SiMysql' },
        { name: 'PostgreSQL', icon: 'SiPostgresql' },
        { name: 'SQL Server', icon: 'SiMicrosoftsqlserver' },
        { name: 'Oracle', icon: 'SiOracle' },
      ],
    },
    {
      title: 'Tools & Integration',
      skills: [
        { name: 'Git & GitHub', icon: 'SiGithub' },
        { name: 'REST APIs', icon: 'SiSwagger' },
        { name: 'Socket.IO', icon: 'SiSocketdotio' },
        { name: 'Firebase', icon: 'SiFirebase' },
        { name: 'Razorpay', icon: 'SiRazorpay' },
        { name: 'Stripe', icon: 'SiStripe' },
        { name: 'JDBC / ODBC', icon: 'SiOracle' },
      ],
    },
  ];

  return (
    <section id="skills" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Tech Stack"
          title="Skills & Technologies"
          description="Comprehensive full-stack development expertise across languages, frameworks, and platforms"
          animate
          isInView={isInView}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              whileHover={{
                rotateY: 2,
                rotateX: -2,
                transition: { duration: 0.3 }
              }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            >
            <Card className="p-8 group h-full">
              <div
                className="absolute inset-0 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent)',
                }}
              />
              <h3 className="text-xl font-semibold mb-6 text-accent">{category.title}</h3>
              <ul className="space-y-3">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = SiIcons[skill.icon];
                  return (
                    <motion.li
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group/item"
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                      )}
                      <span>{skill.name}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </Card>
            </motion.div>
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
            Full-stack expertise with modern frameworks, databases, and cloud technologies. Ready to build scalable solutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
