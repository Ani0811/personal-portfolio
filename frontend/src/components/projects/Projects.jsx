import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeader, ProjectCard, Button, Badge } from '../common';

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const featuredProject = {
    title: 'Rimberio - Real Estate Platform',
    description:
      'Developed a full-stack real estate platform that streamlines property discovery, management, and communication between buyers, sellers, and agents. Designed a user-friendly and visually appealing interface with secure transactions, all from a single integrated platform. Focused on functionality, responsiveness, and seamless user experience.',
    tech: ['React', 'Node.js', 'MongoDB', 'Azure', 'Express'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    featured: true,
    liveUrl: 'https://realstate-e7bfchdfftbee4c6.centralindia01.azurewebsites.net/',
  };

  const projects = [
    {
      title: 'Foodie Frenzy - Restaurant Platform',
      description:
        'Developed a dynamic restaurant website featuring an interactive admin dashboard for menu management, orders, and user activity. Implemented secure payment gateway, automated delivery system, and wishlist/cart functionality with customer reviews for a responsive, engaging experience.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Render'],
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      liveUrl: 'https://foodie-frenzy-frontend-hpkf.onrender.com/',
    },
  ];

  return (
    <section id="projects" ref={ref} className="py-20 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Portfolio"
          title="Featured Projects"
          description="Real applications built for real problems. Each project demonstrates end-to-end execution."
          animate
          isInView={isInView}
        />

        {/* Featured Project */}
        <ProjectCard
          title={featuredProject.title}
          description={featuredProject.description}
          image={featuredProject.image}
          tech={featuredProject.tech}
          featured
          className="mb-12"
          twoColumn
          animate
          animationProps={{
            initial: { opacity: 0, y: 30 },
            animate: isInView ? { opacity: 1, y: 0 } : {},
            transition: { duration: 0.6, delay: 0.2 },
          }}
          actions={
            <>
              <Button
                variant="primary"
                onClick={() => window.open(featuredProject.liveUrl, '_blank')}
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
                  </svg>
                }
              >
                Live Demo
              </Button>
              <Button
                variant="outline"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.874.12 3.176.765.84 1.23 1.911 1.23 3.221 0 4.61-2.805 5.625-5.475 5.921.435.375.825 1.11.825 2.235 0 1.615-.015 2.915-.015 3.31 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                  </svg>
                }
              >
                Source
              </Button>
            </>
          }
        />

        {/* Other Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              tech={project.tech}
              className=""
              twoColumn
              animate
              animationProps={{
                initial: { opacity: 0, y: 30 },
                animate: isInView ? { opacity: 1, y: 0 } : {},
                transition: { duration: 0.6, delay: 0.3 + index * 0.1 },
              }}
              actions={
                <>
                  <Button
                    variant="primary"
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    icon={
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
                      </svg>
                    }
                  >
                    Live Demo
                  </Button>
                  <Button
                    variant="outline"
                    icon={
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.874.12 3.176.765.84 1.23 1.911 1.23 3.221 0 4.61-2.805 5.625-5.475 5.921.435.375.825 1.11.825 2.235 0 1.615-.015 2.915-.015 3.31 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                      </svg>
                    }
                  >
                    Source
                  </Button>
                </>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
