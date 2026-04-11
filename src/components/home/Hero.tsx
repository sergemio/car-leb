import Link from 'next/link';
import { Listing, ListingPhoto } from '@/types';
import { getRandomSketch } from '@/lib/sketches';

interface HeroProps {
  /** Optional featured listing — not used in minimal hero, kept for API compat */
  featured: (Listing & { listing_photos: ListingPhoto[] }) | null;
  totalListings: number;
}

// Hero — minimal editorial layout
// Left: giant title + subtitle + CTAs + stats
// Right: line-art car silhouette (Porsche-ish shape)
// Below: engineering ruler with "00 / Scale 1:1 / N listings"
// See design-language.md §5 "Motorsport hints" — the ruler and silhouette

export function Hero({ totalListings }: HeroProps) {
  // Pick a random sketch on every server render — homepage is `force-dynamic`
  // so each visit gets a different illustration without caching hiccups
  const sketch = getRandomSketch();

  return (
    <section className="border-b border-[var(--gray-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-20 lg:pt-24 pb-16 relative">
        {/* Eyebrow */}
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gray-4)] mb-10 flex items-center gap-3 reveal reveal-1">
          <span className="w-7 h-px bg-[var(--ink)]" />
          LEBANON · EST. 2026
        </div>

        {/* Title + line-art car */}
        <div className="relative">
          <h1 className="font-display text-[72px] sm:text-[112px] lg:text-[148px] font-black leading-[0.85] text-[var(--ink)] max-w-[900px] reveal reveal-2">
            The cars
            <br />
            of <span className="font-light text-[var(--gray-3)]">Lebanon</span>,
            <br />
            indexed.
          </h1>

          {/* Designer sketch illustration — randomized per page load
              See src/lib/sketches.ts. All sketches are 1600x900 on white. */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[48%] max-w-[640px] pointer-events-none">
            <img
              src={sketch}
              alt=""
              aria-hidden
              className="w-full h-auto select-none"
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[17px] leading-[1.55] text-[var(--gray-4)] max-w-[520px] mt-8 reveal reveal-3">
          A quiet marketplace for quality listings. Structured photos, fair prices, no chaos.
          Built for buyers who want to see the full picture.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-10 reveal reveal-4">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full border border-[var(--ink)] bg-[var(--ink)] text-white text-sm font-medium hover:shadow-[4px_4px_0_var(--ink)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200"
          >
            Browse cars →
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full border border-[var(--ink)] bg-transparent text-[var(--ink)] text-sm font-medium hover:bg-[var(--gray-1)] transition-colors duration-200"
          >
            Sell your car
          </Link>
        </div>

        {/* Ruler — engineering graduation marker */}
        <div className="mt-24 pb-6 reveal reveal-5">
          <div className="flex items-end gap-0 h-8 overflow-hidden">
            {Array.from({ length: 61 }).map((_, i) => {
              const isXL = i % 10 === 0;
              const isLG = i % 5 === 0 && !isXL;
              const height = isXL ? 22 : isLG ? 16 : 8;
              return (
                <span
                  key={i}
                  className="flex-1 border-l border-[var(--ink)]"
                  style={{ height }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="text-[var(--ink)]">00</span>
            <span className="text-[var(--gray-4)]">Scale 1:1</span>
            <span className="text-[var(--ink)]">{totalListings} listings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
