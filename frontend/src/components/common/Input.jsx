import { forwardRef } from 'react';

const baseInputClasses =
  'w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-muted-foreground/60';

export const Input = forwardRef(function Input(
  { label, optional = false, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium">
          {label}
          {optional && (
            <span className="text-muted-foreground font-normal"> (Optional)</span>
          )}
        </label>
      )}
      <input ref={ref} className={`${baseInputClasses} ${className}`} {...props} />
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, optional = false, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium">
          {label}
          {optional && (
            <span className="text-muted-foreground font-normal"> (Optional)</span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        className={`${baseInputClasses} resize-none ${className}`}
        {...props}
      />
    </div>
  );
});
