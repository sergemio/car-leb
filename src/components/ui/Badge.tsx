interface BadgeProps {
  variant: 'bronze' | 'silver' | 'gold' | 'info';
  children: React.ReactNode;
  className?: string;
}

const BADGE_STYLES = {
  bronze: 'bg-orange-100 text-orange-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_STYLES[variant]} ${className}`}>
      {children}
    </span>
  );
}
