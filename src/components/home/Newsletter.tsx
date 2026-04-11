'use client';

// Newsletter section — last CTA before footer
// Placeholder: form doesn't submit anywhere yet
// Client component because the form has onSubmit handler

export function Newsletter() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative lime band */}
      <div className="absolute inset-0 bg-[var(--lime)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center text-[var(--lime-ink)]">
          <div className="font-mono text-[10px] font-bold tracking-widest opacity-70 mb-3">
            NEWSLETTER
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[0.95]">
            Be first to know.
          </h2>
          <p className="mt-4 text-base lg:text-lg opacity-80 max-w-lg mx-auto">
            Get the best new listings, auction drops, and market insights. No spam, ever.
          </p>

          <form
            className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-5 h-12 rounded-full bg-white text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none border border-transparent focus:border-[var(--text)]"
            />
            <button
              type="submit"
              className="px-6 h-12 rounded-full bg-[var(--text)] text-white font-semibold text-sm hover:brightness-110 transition-all"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs opacity-60 font-mono">
            2,400+ readers · no spam · unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
