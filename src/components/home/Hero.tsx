import Link from 'next/link';
import { Listing, ListingPhoto } from '@/types';
import { getRandomSketch } from '@/lib/sketches';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

interface HeroProps {
  featuredListings: ListingWithPhotos[];
  totalListings: number;
}

// Hero — split layout: branding left, featured listings right
// Visitors see real inventory above the fold immediately.
// Below both columns: engineering ruler spanning full width.
// See design-language.md §5 "Motorsport hints" — the ruler and silhouette

export function Hero({ featuredListings, totalListings }: HeroProps) {
  const sketch = getRandomSketch();

  return (
    <section className="border-b border-[var(--gray-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-20 lg:pt-24 pb-16">
        {/* Two-column grid: branding left, featured right */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left — branding */}
          <div>
            {/* Eyebrow */}
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gray-4)] mb-10 flex items-center gap-3 reveal reveal-1">
              <span className="w-7 h-px bg-[var(--ink)]" />
              LEBANON · EST. 2026
            </div>

            {/* Title */}
            <h1 className="font-display text-[72px] sm:text-[112px] lg:text-[100px] xl:text-[112px] font-black leading-[0.85] text-[var(--ink)] reveal reveal-2">
              The cars
              <br />
              of <span className="font-light text-[var(--gray-3)]">Lebanon</span>,
              <br />
              indexed.
            </h1>

            {/* Sketch — below title, inline instead of absolute overlay */}
            <div className="hidden lg:block mt-6 max-w-[420px] pointer-events-none reveal reveal-3">
              <img
                src={sketch}
                alt=""
                aria-hidden
                className="w-full h-auto select-none"
              />
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
          </div>

          {/* Right — featured listings */}
          <div className="mt-12 lg:mt-0 reveal reveal-3">
            <div className="flex items-center justify-between mb-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)] flex items-center gap-3">
                <span className="w-7 h-px bg-[var(--ink)]" />
                Featured
              </div>
              <Link
                href="/listings"
                className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--ink)] hover:text-[var(--gray-4)] transition-colors"
              >
                View all →
              </Link>
            </div>

            {featuredListings.length > 0 ? (
              <div className="flex flex-col gap-4">
                {featuredListings.map((listing) => {
                  const photo = listing.listing_photos.find((p) => p.slot === 'front') || listing.listing_photos[0];
                  return (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="group block border border-[var(--gray-2)] rounded-xl overflow-hidden hover:border-[var(--rpm-green)] hover:shadow-[0_0_0_1px_var(--rpm-green),_0_12px_28px_-10px_rgba(34,197,94,0.25)] transition-all duration-200"
                    >
                      {/* Wide photo — 16:9 so the car is clearly visible */}
                      <div className="aspect-[16/9] bg-[var(--gray-1)] overflow-hidden">
                        {photo ? (
                          <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-mono text-[10px] text-[var(--gray-3)]">No photo</span>
                          </div>
                        )}
                      </div>
                      {/* Info bar */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <h3 className="font-display text-[15px] font-medium text-[var(--ink)] truncate">
                          {listing.year} {listing.make} {listing.model}
                        </h3>
                        <span className="font-mono text-[15px] font-bold text-[var(--ink)] flex-shrink-0 ml-3">
                          ${listing.price_usd.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 border border-dashed border-[var(--gray-2)] rounded-xl">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gray-3)]">
                  Listings coming soon
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ruler — engineering graduation marker, full width below both columns */}
        <div className="mt-16 pb-6 reveal reveal-5">
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
