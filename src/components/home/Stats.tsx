interface StatsProps {
  totalListings: number;
}

// Stats section — social proof with big mono numbers
// Full-width band with subtle tint, stats in a grid

const STATS_STATIC = [
  { label: 'Regions covered', value: '6' },
  { label: 'Avg time to sell', value: '3d' },
  { label: 'Total value', value: '$280K+' },
];

export function Stats({ totalListings }: StatsProps) {
  return (
    <section className="bg-[var(--text)] text-white relative overflow-hidden">
      {/* Lime accent bar on top */}
      <div className="h-1 bg-[var(--lime)]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="font-mono text-5xl lg:text-6xl font-bold text-[var(--lime)] leading-none tracking-tighter">
              {totalListings}
            </div>
            <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-white/60">
              Active listings
            </div>
          </div>
          {STATS_STATIC.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-5xl lg:text-6xl font-bold text-white leading-none tracking-tighter">
                {s.value}
              </div>
              <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-white/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="mt-12 font-display text-2xl lg:text-3xl text-white/90 max-w-2xl leading-tight">
          Lebanon&apos;s car market, finally{' '}
          <em className="italic text-[var(--lime)]">organized</em>.
        </p>
      </div>
    </section>
  );
}
