// Why Car Leb — value propositions / trust section
// 4 pillars that make Car Leb different from OLX / Facebook Marketplace

interface Pillar {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const iconClass = 'w-6 h-6';

const PILLARS: Pillar[] = [
  {
    title: 'Structured photos',
    body: 'Front, rear, quarters, dashboard, wheels. Every listing shows the full picture — no more guessing.',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Quality scoring',
    body: 'Better listings rank higher. No more $1 prices or bait-and-switch. Lazy ads sink to the bottom.',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: 'AI moderation',
    body: 'Suspicious prices flagged. Photos verified. Dubious listings reviewed before hitting the feed.',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Direct contact',
    body: 'WhatsApp the seller in one tap. No intermediaries, no hidden fees. Just buyer meets seller.',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export function WhyCarLeb() {
  return (
    <section id="about" className="border-b border-[var(--border)] bg-[var(--surface-2)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] mb-2">
            WHY CAR LEB
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text)]">
            Built different.<br />
            <em className="italic text-[var(--text-muted)]">Built for Lebanon.</em>
          </h2>
          <p className="text-[var(--text-muted)] mt-4 text-base max-w-xl leading-relaxed">
            Tired of OLX chaos and Facebook Marketplace scams? So were we. Here&apos;s what we&apos;re doing about it.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--text)] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--lime-soft)] flex items-center justify-center text-[var(--lime-ink)] mb-4 group-hover:bg-[var(--lime)] transition-colors">
                {pillar.icon}
              </div>
              <h3 className="font-display text-xl font-medium text-[var(--text)] mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
