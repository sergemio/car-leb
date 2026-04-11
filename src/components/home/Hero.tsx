import Link from 'next/link';
import { Listing, ListingPhoto } from '@/types';

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
          <h1 className="font-display text-[64px] sm:text-[96px] lg:text-[128px] font-normal leading-[0.9] tracking-[-0.045em] text-[var(--ink)] max-w-[900px] reveal reveal-2">
            The cars
            <br />
            of <em className="italic font-light text-[var(--gray-3)]">Lebanon</em>,
            <br />
            indexed.
          </h1>

          {/* Line-art car silhouette — absolute positioned to not push layout */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[44%] max-w-[560px] pointer-events-none opacity-95">
            <svg viewBox="0 0 800 300" className="w-full h-auto" fill="none" stroke="#0A0A0A" strokeWidth="1">
              <line x1="20" y1="240" x2="780" y2="240" strokeWidth="0.6" />
              <path d="M60 240 Q70 210 100 200 L180 180 Q220 160 260 150 L360 140 Q440 130 520 140 L620 160 Q680 180 720 210 L760 230 Q770 238 760 240 Z" />
              <path d="M240 160 Q300 100 400 95 Q500 92 580 130 L620 160" />
              <path d="M280 155 Q330 115 400 112 L400 155 Z" />
              <path d="M410 112 Q490 115 570 150 L410 155 Z" />
              <line x1="400" y1="155" x2="400" y2="230" strokeWidth="0.5" />
              <circle cx="190" cy="240" r="34" />
              <circle cx="190" cy="240" r="20" />
              <circle cx="610" cy="240" r="34" />
              <circle cx="610" cy="240" r="20" />
              <circle cx="735" cy="210" r="4" strokeWidth="0.5" />
              <circle cx="85" cy="215" r="3" strokeWidth="0.5" />
            </svg>
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
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full border border-[var(--ink)] bg-[var(--ink)] text-white text-sm font-medium hover:bg-white hover:text-[var(--ink)] transition-colors duration-200"
          >
            Browse cars →
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-full border border-[var(--ink)] bg-transparent text-[var(--ink)] text-sm font-medium hover:bg-[var(--ink)] hover:text-white transition-colors duration-200"
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
