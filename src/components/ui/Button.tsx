// Base button — pill shape, invert on hover
// See design-language.md §8 "Button"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';

  const variants = {
    // Primary — black pill, hover lifts with offset shadow (keeps identity)
    primary:
      'border-[var(--ink)] bg-[var(--ink)] text-white hover:shadow-[4px_4px_0_var(--ink)] hover:-translate-x-[2px] hover:-translate-y-[2px]',
    // Outline — transparent with black border, hover fills subtly with gray-1
    outline:
      'border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--gray-1)]',
    // Ghost — no border, muted text, fills bg on hover
    ghost:
      'border-transparent bg-transparent text-[var(--gray-4)] hover:text-[var(--ink)] hover:bg-[var(--gray-1)]',
  };

  const sizes = {
    sm: 'px-4 h-9 text-[13px]',
    md: 'px-5 h-11 text-sm',
    lg: 'px-6 h-12 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
