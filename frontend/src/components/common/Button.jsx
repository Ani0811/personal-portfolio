import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90',
  contact:
    'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-lg shadow-[color:var(--color-accent)/20] hover:opacity-95 hover:shadow-2xl hover:scale-105',
  secondary: 'bg-[var(--color-card)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-accent)/5] hover:shadow-md hover:scale-105',
  outline: 'border border-[color:var(--color-border)] hover:bg-[color:var(--color-accent)/5]',
  ghost: 'hover:bg-[color:var(--color-accent)/10]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    iconPosition = 'left',
    animate = false,
    disabled = false,
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none';

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabledClass}`;

  const { href, target, rel, ...restProps } = props;
  const isLink = Boolean(href);

  // Inline styles using CSS variables to ensure correct colors across themes
  const varStyle = {};
  if (variant === 'primary' || variant === 'contact') {
    varStyle.backgroundColor = 'var(--color-accent)';
    varStyle.color = 'var(--color-accent-foreground)';
  }
  if (variant === 'secondary') {
    varStyle.backgroundColor = 'var(--color-card)';
    varStyle.color = 'var(--color-card-foreground)';
    varStyle.borderColor = 'var(--color-border)';
  }
  if (variant === 'outline') {
    varStyle.backgroundColor = 'transparent';
    varStyle.color = 'var(--color-foreground)';
    varStyle.borderColor = 'var(--color-border)';
  }
  if (variant === 'ghost') {
    varStyle.backgroundColor = 'transparent';
  }

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  );

  if (animate) {
    if (isLink) {
      return (
        <motion.a
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={classes}
          style={varStyle}
          aria-disabled={disabled}
          {...restProps}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={classes}
        style={varStyle}
        disabled={disabled}
        {...restProps}
      >
        {content}
      </motion.button>
    );
  }

  if (isLink) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={classes} style={varStyle} aria-disabled={disabled} {...restProps}>
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} className={classes} style={varStyle} disabled={disabled} {...restProps}>
      {content}
    </button>
  );
});
