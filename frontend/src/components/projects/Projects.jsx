import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SectionHeader, ProjectCard, Button } from '../common';

// Images are served from the `public/` folder at runtime — use direct public URLs

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Rimberio carousel images (public URLs)
  const rimberioImages = [
    '/assets/images/Rimberio/Rimberio-LandingPage.png',
    '/assets/images/Rimberio/Rimberio-Analytics.png',
    '/assets/images/Rimberio/Rimberio-Properties.png',
    '/assets/images/Rimberio/Rimberio-Reviews.png',
    '/assets/images/Rimberio/Rimberio-SeeMore.png',
    '/assets/images/Rimberio/Rimberio-Support.png',
    '/assets/images/Rimberio/Rimberio-Users.jpeg',
  ];

  const [currentRimberioImage, setCurrentRimberioImage] = useState(rimberioImages[0]);

  // FoodieFrenzy carousel images (public URLs)
  const foodieImages = [
    '/assets/images/FoodieFrenzy/FoodieFrenzy-LandingPage.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-Menu.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-FoodItemDetail.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-OrderTracking.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-Cart.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-Delivered.png',
    '/assets/images/FoodieFrenzy/FoodieFrenzy-Dashboard.png',
  ];

  const [currentFoodieImage, setCurrentFoodieImage] = useState(foodieImages[0]);

  // Carousel config: interval in ms and probability of showing landing image occasionally
  const RIMBERIO_DISPLAY = 8000; // display interval for featured (slower)
  const FOODIE_DISPLAY = 6000; // display interval for foodie (slower)
  const LANDING_PROBABILITY = 0.20;

  useEffect(() => {
    if (!isInView) return;

    setCurrentRimberioImage(rimberioImages[0]);
    const otherImages = rimberioImages.slice(1);

    const interval = setInterval(() => {
      if (Math.random() < LANDING_PROBABILITY) {
        setCurrentRimberioImage(rimberioImages[0]);
        return;
      }
      const randomIndex = Math.floor(Math.random() * otherImages.length);
      setCurrentRimberioImage(otherImages[randomIndex]);
    }, RIMBERIO_DISPLAY);

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    setCurrentFoodieImage(foodieImages[0]);
    const other = foodieImages.slice(1);
    const shuffled = other.slice().sort(() => Math.random() - 0.5);
    let idxRef = 0;
    const FOODIE_INTERVAL = FOODIE_DISPLAY;
    const FOODIE_LANDING_PROB = 0.15;

    const interval = setInterval(() => {
      if (Math.random() < FOODIE_LANDING_PROB) {
        setCurrentFoodieImage(foodieImages[0]);
      } else {
        setCurrentFoodieImage(shuffled[idxRef % shuffled.length]);
        idxRef += 1;
      }
    }, FOODIE_INTERVAL);

    return () => clearInterval(interval);
  }, [isInView]);

  function FadeImage({ src, alt }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    
    const resolvedSrc =
      typeof window !== 'undefined' && src?.startsWith('/')
        ? `${window.location.origin}${src}`
        : src;

    useEffect(() => {
      setLoaded(false);
      setError(false);
      setImgSrc(resolvedSrc);
    }, [resolvedSrc]);

    return (
      <div className="relative w-full rounded-md overflow-hidden bg-gray-800" style={{ minHeight: '250px', height: '100%' }}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-700">
            <span className="text-sm">Image unavailable</span>
          </div>
        ) : (
          <>
            <img
              src={imgSrc}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: loaded ? 1 : 0 }}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              loading="eager"
              decoding="async"
            />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const featuredProject = {
    title: 'Rimberio - Real Estate Platform',
    description:
      'Developed a full-stack real estate platform that streamlines property discovery, management, and communication between buyers, sellers, and agents. Designed a user-friendly and visually appealing interface with secure transactions, all from a single integrated platform. Focused on functionality, responsiveness, and seamless user experience.',
    tech: ['React', 'Node.js', 'MySQL', 'Firebase', 'Azure', 'Express'],
    image: <FadeImage src={currentRimberioImage} alt="Rimberio screenshot" />,
    featured: true,
    liveUrl: 'https://realstate-e7bfchdfftbee4c6.centralindia-01.azurewebsites.net/',
  };

  const projects = [
    {
      title: 'Foodie Frenzy - Restaurant Platform',
      description:
        'Developed a dynamic restaurant website featuring an interactive admin dashboard for menu management, orders, and user activity. Implemented secure payment gateway, automated delivery system, and wishlist/cart functionality with customer reviews for a responsive, engaging experience.',
      tech: ['React', 'Node.js', 'MongoDB', 'Firebase', 'Express', 'Render'],
      image: <FadeImage src={currentFoodieImage} alt="Foodie Frenzy screenshot" />,
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
                animate
                className="w-full sm:w-auto"
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
                animate
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.874.12 3.176.765.84 1.23 1.911 1.23 3.221 0 4.61-2.805 5.625-5.475 5.921.435.375.825 1.11.825 2.235 0 1.615-.015 2.915-.015 3.31 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                  </svg>
                }
              >
                Source - Available On Request
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
                    animate
                    className="w-full sm:w-auto"
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
                    animate
                    className="w-full sm:w-auto"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    icon={
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.874.12 3.176.765.84 1.23 1.911 1.23 3.221 0 4.61-2.805 5.625-5.475 5.921.435.375.825 1.11.825 2.235 0 1.615-.015 2.915-.015 3.31 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                      </svg>
                    }
                  >
                    Source - Available On Request
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
