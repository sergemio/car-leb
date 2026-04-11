// Minimal progress bar — ink fill on gray-2 track, mono % label
// No color stops — the listing quality label carries the meaning

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, showLabel = true, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 bg-[var(--gray-2)] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--ink)] transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[11px] font-bold text-[var(--ink)] min-w-[3ch] tabular-nums">
          {clamped}%
        </span>
      )}
    </div>
  );
}
