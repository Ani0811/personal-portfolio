import { motion } from 'framer-motion';

export function SectionHeader({
  label,
  title,
  description,
  centered = true,
  animate = false,
  isInView = true,
  className = '',
}) {
  const content = (
    <>
      {label && (
        <span
          role="button"
          tabIndex={0}
          className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs tracking-widest uppercase mb-4 font-semibold border border-accent/20 transition-all duration-200 hover:bg-accent/20 hover:border-accent/40 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-3d" style={{ color: 'var(--color-accent)' }}>{title}</h2>
      <div className={`${centered ? 'mx-auto' : ''} ${description ? 'mb-4' : ''}`} style={{ width: '5rem', height: '0.25rem', background: 'var(--color-accent)' }} />
      {description && (
        <p className={`${centered ? 'max-w-2xl mx-auto' : ''} text-muted-foreground`}>
          {description}
        </p>
      )}
    </>
  );

  const classes = `${centered ? 'text-center' : ''} mb-16 ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className={classes}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={classes}>{content}</div>;
}
