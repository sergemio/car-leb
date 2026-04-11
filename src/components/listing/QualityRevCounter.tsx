'use client';

import { QualityTier } from '@/types';

// Listing quality indicator shaped like a digital Lamborghini rev counter.
// Sticky under the navbar on /sell so the score is always visible as
// the user fills the wizard. Segments follow an ease-in height curve
// so the green zone stays flat and bars accelerate through yellow,
// orange, and red — like engine revs climbing to redline.
// See mockup: topics/car-leb/mockups/rpm-quality-bar.html

interface QualityRevCounterProps {
  score: number;
  tier: QualityTier;
}

const TOTAL = 20;

// Ease-in heights — green zone flat, bars grow faster through the hot zones.
// Percentage of counter height for each segment (index 0..19).
const HEIGHTS = [
  25, 25, 26, 27, 28, 30, 32, 35, 38, 42,
  46, 50, 55, 60, 66, 72, 78, 85, 92, 100,
];

// Color zones: 10 green, 5 yellow, 3 orange, 2 red
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

const TIER_LABELS: Record<QualityTier, string> = {
  poor:  'Poor 🔧',
  fair:  'Fair ⚙️',
  good:  'Good 🏁',
  prime: 'Prime 🏆',
};

export function QualityRevCounter({ score, tier }: QualityRevCounterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const filled  = Math.round((clamped / 100) * TOTAL);

  return (
    <div className="sticky top-[72px] z-30 bg-white border-b border-[var(--gray-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 sm:grid-cols-[auto_1fr_auto] sm:grid-rows-1 max-sm:grid-cols-[1fr_auto] max-sm:grid-rows-[auto_auto] max-sm:gap-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] whitespace-nowrap max-sm:col-start-1 max-sm:row-start-1">
            <span className="text-[var(--ink)]">— </span>Listing quality
          </div>

          {/* The rev counter */}
          <div className="flex items-end gap-[3px] h-9 sm:h-9 max-sm:h-7 w-full min-w-0 max-sm:col-span-2 max-sm:row-start-2">
            {HEIGHTS.map((h, i) => {
              const on = i < filled;
              const zone = zoneFor(i);
              return (
                <div
                  key={i}
                  className={`flex-1 min-w-0 rounded-[1px] transition-all duration-200 ease-out ${
                    on ? ZONE_CLASSES[zone] : 'bg-[var(--gray-2)]'
                  }`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3 whitespace-nowrap max-sm:col-start-2 max-sm:row-start-1 max-sm:justify-end">
            <span className="font-mono text-[16px] sm:text-[18px] font-bold text-[var(--ink)] tabular-nums min-w-[46px] text-right">
              {clamped}%
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--ink)] border border-[var(--ink)] rounded-full px-3 py-1.5">
              {TIER_LABELS[tier]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
