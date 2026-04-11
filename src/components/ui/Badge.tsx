// Minimal chip — pill shape, mono uppercase text, hairline border
// Used for quality tiers and generic info chips

interface BadgeProps {
  variant: 'bronze' | 'silver' | 'gold' | 'info';
  children: React.ReactNode;
  className?: string;
}

// All variants look the same — monochrome chip with hairline border.
// The label text carries the meaning, not the color.
const BADGE_STYLE =
  'bg-white border border-[var(--ink)] text-[var(--ink)]';

export function Badge({ variant: _variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${BADGE_STYLE} ${className}`}
    >
      {children}
    </span>
  );
}
