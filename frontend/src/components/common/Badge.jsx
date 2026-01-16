const variants = {
  default: 'bg-accent/10 text-accent border border-accent/20',
  solid: 'bg-accent text-accent-foreground',
  outline: 'border border-accent/30 text-accent',
  muted: 'bg-muted text-muted-foreground',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const classes = `inline-block rounded-lg tracking-wide relative overflow-hidden group ${variants[variant]} ${sizes[size]} ${className}`;

  // Ensure colors follow CSS variables across light/dark themes
  const varStyle = {};
  if (variant === 'default' || variant === 'outline') {
    varStyle.color = 'var(--color-accent)';
    varStyle.borderColor = 'var(--color-accent)';
    if (variant === 'default') varStyle.backgroundColor = 'color-mix(in srgb, var(--color-accent) 10%, transparent)';
  }
  if (variant === 'solid') {
    varStyle.backgroundColor = 'var(--color-accent)';
    varStyle.color = 'var(--color-accent-foreground)';
  }
  if (variant === 'muted') {
    varStyle.backgroundColor = 'var(--color-muted)';
    varStyle.color = 'var(--color-muted-foreground)';
  }

  return (
    <span className={classes} {...props}>
      <span
        className="absolute inset-0 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent)',
        }}
      />
      <span className="relative z-10" style={varStyle}>
        {children}
      </span>
    </span>
  );
}
