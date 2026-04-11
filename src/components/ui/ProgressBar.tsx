// Progress bar styled as RPM gauge — uses the same green/orange/yellow
// color language as the card hover cooldown animation.
// Green = high completeness, orange = mid, yellow = low.

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

function getRpmColor(pct: number): string {
  if (pct >= 70) return 'var(--rpm-green)';
  if (pct >= 40) return 'var(--rpm-orange)';
  return 'var(--rpm-yellow)';
}

export function ProgressBar({ value, showLabel = true, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = getRpmColor(clamped);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 bg-[var(--gray-2)] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[11px] font-bold min-w-[3ch] tabular-nums" style={{ color }}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
