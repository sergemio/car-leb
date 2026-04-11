// How it works section — 3 steps for sellers
// Design: numbered, big type, alternating subtle row accents

interface Step {
  number: string;
  title: string;
  body: string;
  accent: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'List your car',
    body: 'Fill structured photo slots — front, rear, sides, dashboard, wheels. Our wizard walks you through it in 3 minutes.',
    accent: 'Upload',
  },
  {
    number: '02',
    title: 'Get discovered',
    body: 'Better listings rank higher. Our quality score rewards sellers who take the time to show the full picture.',
    accent: 'Rank up',
  },
  {
    number: '03',
    title: 'Close the deal',
    body: 'Buyers reach you by WhatsApp or in-app chat. Meet, inspect, shake hands. You keep 100% of the sale.',
    accent: 'Done',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] mb-2">
            FOR SELLERS
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-black text-[var(--text)]">
            Sell your car in <span className="font-light text-[var(--text-muted)]">three steps</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] rounded-3xl overflow-hidden border border-[var(--border)]">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-[var(--surface)] p-8 lg:p-10 relative group hover:bg-[var(--lime-soft)] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-6xl font-bold text-[var(--text-faint)] group-hover:text-[var(--lime-ink)] transition-colors leading-none">
                  {step.number}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] group-hover:text-[var(--lime-ink)] transition-colors pt-2">
                  → {step.accent}
                </span>
              </div>
              <h3 className="font-display text-2xl font-medium text-[var(--text)] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text)] transition-colors">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
