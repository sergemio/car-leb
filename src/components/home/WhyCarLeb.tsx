// Why Car Leb — 4 pillars on a gray-1 band
// See design-language.md §8 "Pillar"

interface Pillar {
  num: string;
  title: string;
  body: string;
}

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

export function WhyCarLeb() {
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
      </div>
    </section>
  );
}
