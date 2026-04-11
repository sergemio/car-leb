interface StatsProps {
  totalListings: number;
}

// Stats band — 4 big numbers in Bricolage serif, mono labels
// Hairline vertical dividers, no dark background
// See design-language.md §8 "Stat"

const STATIC_STATS = [
  { value: '06', label: 'Regions' },
  { value: '3d', label: 'Avg. time to sell' },
  { value: '280K+', label: 'Total value USD' },
];

export function Stats({ totalListings }: StatsProps) {
  return (
    <section className="border-b border-[var(--gray-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          <Stat value={totalListings.toString().padStart(2, '0')} label="Active listings" first />
          {STATIC_STATS.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  first = false,
}: {
  value: string;
  label: string;
  first?: boolean;
}) {
  return (
    <div className={`px-6 ${first ? 'lg:pl-0 lg:border-l-0' : 'lg:border-l lg:border-[var(--gray-2)]'}`}>
      <div className="font-display text-[72px] font-normal leading-[0.9] tracking-[-0.04em] text-[var(--ink)]">
        {value}
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
        {label}
      </div>
    </div>
  );
}
