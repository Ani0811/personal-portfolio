import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useRef } from 'react';

export function Card({
  children,
  className = '',
  hover = true,
  animate = false,
  animationProps = {},
  ...props
}) {
  const baseClasses = `bg-card border border-border rounded-lg relative overflow-hidden transition-all duration-200 transform ${
    hover ? 'hover:border-accent/50 hover:-translate-y-1 hover:shadow-md' : ''
  } ${className}`;

  if (animate) {
    return (
      <motion.div className={baseClasses} {...animationProps} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  className = '',
  animate = false,
  animationProps = {},
}) {
  const innerRef = useRef(null);
  const iconRef = useRef(null);
  const motionAllowed = typeof window !== 'undefined' ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true;

  const handleEnter = () => {
    if (!motionAllowed) return;
    if (innerRef.current) innerRef.current.style.transform = 'translateZ(12px)';
    if (iconRef.current) iconRef.current.style.transform = 'translateZ(30px) scale(1.04)';
  };

  const handleLeave = () => {
    if (!innerRef.current && !iconRef.current) return;
    if (innerRef.current) innerRef.current.style.transform = '';
    if (iconRef.current) iconRef.current.style.transform = '';
  };

  const content = (
    <>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent)',
        }}
      />
      <div
        ref={iconRef}
        className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center transition-colors"
        style={{ transform: 'translateZ(0)', transition: 'transform 260ms ease', transformStyle: 'preserve-3d' }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-3d">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </>
  );

  const classes = `flex gap-4 p-6 bg-card border border-border rounded-lg hover:border-accent/50 transition-all duration-200 transform relative overflow-hidden group hover:-translate-y-1 hover:shadow-sm ${className}`;

  if (animate) {
    return (
      <motion.div
        className={classes}
        {...animationProps}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div ref={innerRef} style={{ transformStyle: 'preserve-3d', transition: 'transform 260ms ease' }}>
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={classes} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div ref={innerRef} style={{ transformStyle: 'preserve-3d', transition: 'transform 260ms ease' }}>
        {content}
      </div>
    </div>
  );
}

export function ProjectCard({
  title,
  description,
  image,
  tech = [],
  featured = false,
  actions,
  className = '',
  twoColumn = false,
  animate = false,
  animationProps = {},
}) {
  const content = (
    <>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent)',
        }}
      />
      <div className="relative h-48 lg:h-full lg:col-span-1 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-transparent z-10" />
        {typeof image === 'string' ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          image
        )}
        {featured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-900 text-sm font-semibold rounded-full flex items-center shadow-sm">
              <Star className="w-4 h-4 text-yellow-700 dark:text-yellow-900 mr-2" />
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-6 lg:p-8 flex flex-col justify-center lg:flex-1 lg:col-span-1">
        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-3d">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tech.map((item) => (
              <span
                key={item}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md border border-accent/20"
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </>
  );

  const baseWrapper = `group bg-card border border-border rounded-lg overflow-hidden relative hover:border-accent/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${className}`;
  const classes = twoColumn
    ? `${baseWrapper} lg:grid lg:grid-cols-2 items-stretch`
    : `${baseWrapper} items-stretch`;

  if (animate) {
    return (
      <motion.div className={classes} {...animationProps}>
        {content}
      </motion.div>
    );
  }

  return <div className={classes}>{content}</div>;
}
