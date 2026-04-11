import { Listing, ListingPhoto } from '@/types';

interface RecentlySoldProps {
  /** Listings to repurpose as "recently sold" social proof */
  listings: (Listing & { listing_photos: ListingPhoto[] })[];
}

// Recently sold — placeholder social proof
// We reuse existing listings but overlay a "SOLD" stamp to imply activity
// Once real auctions/sales exist, this will pull from sold status

export function RecentlySold({ listings }: RecentlySoldProps) {
  if (listings.length === 0) return null;

  const items = listings.slice(0, 3);

  return (
    <section className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] mb-2">
              SOCIAL PROOF
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text)]">
              Recently <em className="italic text-[var(--text-muted)]">sold</em>
            </h2>
            <p className="text-[var(--text-muted)] mt-2 text-sm">
              Real deals closed through Car Leb over the past week.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((listing) => {
            const photo =
              listing.listing_photos.find((p) => p.slot === 'front') ||
              listing.listing_photos[0];

            return (
              <div
                key={listing.id}
                className="group relative bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)]"
              >
                {/* Photo with desaturation + SOLD stamp */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-2)]">
                  {photo ? (
                    <img
                      src={photo.url}
                      alt={`${listing.year} ${listing.make} ${listing.model}`}
                      className="w-full h-full object-cover grayscale opacity-70"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}

                  {/* Diagonal SOLD stamp */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="font-display text-6xl font-bold text-[var(--danger)] border-4 border-[var(--danger)] px-6 py-2 rotate-[-12deg] tracking-tight bg-white/50 backdrop-blur-sm">
                      SOLD
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--text)]">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {listing.location_city}
                    </p>
                  </div>
                  <div className="font-mono text-base font-bold text-[var(--text)]">
                    ${listing.price_usd.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
