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
        <span className="text-accent text-sm tracking-widest uppercase mb-3 block">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{title}</h2>
      <div className={`w-20 h-1 bg-accent ${centered ? 'mx-auto' : ''} ${description ? 'mb-4' : ''}`} />
      {description && (
        <p className={`text-muted-foreground ${centered ? 'max-w-2xl mx-auto' : ''}`}>
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
