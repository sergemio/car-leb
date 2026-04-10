interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, showLabel = true, className = '' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const color =
    clampedValue >= 80 ? 'bg-green-500' :
    clampedValue >= 50 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 min-w-[3ch]">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
