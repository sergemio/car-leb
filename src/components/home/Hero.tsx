import Link from 'next/link';
import { Listing, ListingPhoto } from '@/types';

interface HeroProps {
  /** Featured listing shown on the right side */
  featured: (Listing & { listing_photos: ListingPhoto[] }) | null;
  /** Total active listings across the platform */
  totalListings: number;
}

// Hero section — the "above the fold" moment
// Split layout: copy + search left, featured listing card right
// Uses the top-scoring listing as the showcase to brag about quality
export function Hero({ featured, totalListings }: HeroProps) {
  const featuredPhoto =
    featured?.listing_photos.find((p) => p.slot === 'front') || featured?.listing_photos[0];

  return (
    <section className="relative border-b border-[var(--border)] overflow-hidden">
      {/* Lime accent blob — decorative */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[var(--lime)] opacity-20 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy + search */}
          <div className="lg:col-span-6 space-y-6 reveal reveal-1">
            {/* Pre-title with LIVE indicator */}
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[var(--text-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--danger)] opacity-75 live-dot" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--danger)]" />
              </span>
              THE LEBANESE CAR MARKETPLACE
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.95] text-[var(--text)] tracking-tight">
              Find your next{' '}
              <em className="italic font-normal text-[var(--text-muted)]">ride</em>
              <br />
              in Lebanon.
            </h1>

            <p className="text-base lg:text-lg text-[var(--text-muted)] max-w-lg leading-relaxed">
              Quality listings. Structured photos. Fair prices. The marketplace built for buyers
              who want the full picture — not just a blurry thumbnail.
            </p>

            {/* Hero search bar — bigger, bolder */}
            <form
              action="/listings"
              method="get"
              className="flex items-center gap-2 p-2 bg-[var(--surface)] rounded-full border border-[var(--border)] shadow-lg shadow-black/5 max-w-xl focus-within:border-[var(--text)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--text-muted)] ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                placeholder="BMW M4, Range Rover Sport, Toyota Camry..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-[var(--text-faint)]"
              />
              <button
                type="submit"
                className="px-5 h-11 rounded-full bg-[var(--text)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all shrink-0"
              >
                Search
              </button>
            </form>

            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--text)]">
                  {totalListings}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  active listings
                </div>
              </div>
              <div className="h-10 w-px bg-[var(--border)]" />
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--text)]">6</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  regions
                </div>
              </div>
              <div className="h-10 w-px bg-[var(--border)]" />
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--text)]">$280K+</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  total value
                </div>
              </div>
            </div>
          </div>

          {/* Featured listing card — right side */}
          {featured && (
            <div className="lg:col-span-6 reveal reveal-3">
              <Link
                href={`/listings/${featured.id}`}
                className="group block relative rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text)] transition-all shadow-2xl shadow-black/10"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {featuredPhoto ? (
                    <img
                      src={featuredPhoto.url}
                      alt={`${featured.year} ${featured.make} ${featured.model}`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--surface-2)] to-[var(--border)]" />
                  )}

                  {/* Top bar — featured label + tier */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--lime)] text-[var(--lime-ink)] text-[10px] font-mono font-bold tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime-ink)]" />
                      FEATURED
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--gold)] text-[#2B1A00] text-[10px] font-mono font-bold tracking-wider">
                      GOLD
                    </span>
                  </div>

                  {/* Bottom overlay with info */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-medium leading-tight">
                          {featured.year} {featured.make} {featured.model}
                        </h3>
                        <p className="text-sm text-white/80 mt-1">
                          {featured.location_city} · {featured.mileage_km.toLocaleString()} km
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-2xl font-bold">
                          ${featured.price_usd.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono tracking-wider text-white/70">USD</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View details row */}
                <div className="flex items-center justify-between px-5 py-4 bg-[var(--surface)]">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    View listing →
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">
                    8 / 8 photos
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
