// About section — 4 pillars + the marketplace stats row
// Lives at the bottom of the home page; stats were moved out of the
// above-the-fold area to push listings higher.
// See design-language.md §8 "Pillar"

interface Pillar {
  num: string;
  title: string;
  body: string;
}

interface WhyCarLebProps {
  totalListings: number;
}

const STATIC_STATS = [
  { value: '06',    label: 'Regions' },
  { value: '3d',    label: 'Avg. time to sell' },
  { value: '280K+', label: 'Total value USD' },
];

const PILLARS: Pillar[] = [
  {
    num: '01 / 04',
    title: 'Structured photos',
    body: 'Front, rear, quarters, dashboard, wheels. Every listing shows the full picture.',
  },
  {
    num: '02 / 04',
    title: 'Quality scoring',
    body: 'Better listings rank higher. No more $1 prices or bait-and-switch.',
  },
  {
    num: '03 / 04',
    title: 'AI moderation',
    body: 'Suspicious prices flagged. Photos verified before hitting the feed.',
  },
  {
    num: '04 / 04',
    title: 'Direct contact',
    body: 'WhatsApp the seller in one tap. No intermediaries, no hidden fees.',
  },
];

export function WhyCarLeb({ totalListings }: WhyCarLebProps) {
  return (
    <section id="about" className="border-b border-[var(--gray-2)] bg-[var(--gray-1)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24">
        <h2 className="font-display text-[72px] font-black leading-[0.88] text-[var(--ink)] max-w-[640px] mb-12">
          Built different.<br />
          <span className="font-light text-[var(--gray-3)]">Built for Lebanon.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {PILLARS.map((p, i) => (
            <div
              key={p.num}
              className={`px-6 ${
                i === 0 ? 'lg:pl-0 lg:border-l-0' : 'lg:border-l lg:border-[var(--gray-2)]'
              }`}
            >
              <div className="font-mono text-[11px] tracking-[0.12em] text-[var(--gray-4)] mb-6">
                {p.num}
              </div>
              <h3 className="font-display text-[22px] font-medium text-[var(--ink)] mb-2">
                {p.title}
              </h3>
              <p className="text-[13px] leading-[1.55] text-[var(--gray-4)]">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Stats row — moved here from the home top */}
        <div className="mt-20 pt-12 border-t border-[var(--gray-2)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-8">
            — By the numbers
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            <Stat value={totalListings.toString().padStart(2, '0')} label="Active listings" first />
            {STATIC_STATS.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
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
    <div className={`px-6 ${first ? 'lg:pl-0 lg:border-l-0' : 'lg:border-l lg:border-[var(--gray-3)]/40'}`}>
      <div className="font-display text-[56px] font-black leading-[0.88] text-[var(--ink)]">
        {value}
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
        {label}
      </div>
    </div>
  );
}
