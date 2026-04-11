// Static rev counter — same segmented bar visual as QualityRevCounter
// but inline (not sticky). Used on listing detail pages to show
// completeness score in a way that's visually consistent with the
// wizard's live rev counter.

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

const TOTAL = 20;

const HEIGHTS = [
  25, 25, 26, 27, 28, 30, 32, 35, 38, 42,
  46, 50, 55, 60, 66, 72, 78, 85, 92, 100,
];

function zoneFor(i: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (i < 10) return 'green';
  if (i < 15) return 'yellow';
  if (i < 18) return 'orange';
  return 'red';
}

const ZONE_CLASSES: Record<ReturnType<typeof zoneFor>, string> = {
  green:  'bg-[var(--rpm-green)]  shadow-[0_0_8px_rgba(34,197,94,0.5)]',
  yellow: 'bg-[var(--rpm-yellow)] shadow-[0_0_8px_rgba(234,179,8,0.5)]',
  orange: 'bg-[var(--rpm-orange)] shadow-[0_0_10px_rgba(245,158,11,0.6)]',
  red:    'bg-[var(--lb-red)]     shadow-[0_0_12px_rgba(239,68,68,0.7)]',
};

export function ProgressBar({ value, showLabel = true, className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round((clamped / 100) * TOTAL);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-end gap-[3px] h-7 flex-1 min-w-0">
        {HEIGHTS.map((h, i) => {
          const on = i < filled;
          const zone = zoneFor(i);
          return (
            <div
              key={i}
              className={`flex-1 min-w-0 rounded-[1px] ${
                on ? ZONE_CLASSES[zone] : 'bg-[var(--gray-2)]'
              }`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
      {showLabel && (
        <span className="font-mono text-[16px] font-bold text-[var(--ink)] tabular-nums min-w-[46px] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
