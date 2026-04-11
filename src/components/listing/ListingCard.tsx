import Link from 'next/link';
import { Listing, ListingPhoto, QualityTier } from '@/types';

interface ListingCardProps {
  listing: Listing & { listing_photos: ListingPhoto[] };
  /** If true, the photo block is taller — for hero/featured slots */
  featured?: boolean;
}

// Quality tier badge styling — matches Electric White system, no generic chips
const TIER_STYLES: Record<QualityTier, { label: string; classes: string }> = {
  gold: {
    label: 'GOLD',
    classes: 'bg-[var(--gold)] text-[#2B1A00]',
  },
  silver: {
    label: 'SILVER',
    classes: 'bg-white text-[var(--text)] ring-1 ring-[var(--border)]',
  },
  bronze: {
    label: 'BRONZE',
    classes: 'bg-[#F5E6D3] text-[#6B3F11]',
  },
};

// Format "x time ago" without dragging in date-fns — lightweight helper
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

// Deterministic fake view count based on the id — stable across renders/SSR
// Why: gives social proof feel without needing a real tracking system yet
function fakeViewCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return 40 + Math.abs(hash % 480);
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const mainPhoto =
    listing.listing_photos.find((p) => p.slot === 'front') || listing.listing_photos[0];
  const tier = TIER_STYLES[listing.quality_tier];
  const views = fakeViewCount(listing.id);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative block bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[var(--text)] transition-colors rounded-2xl"
    >
      {/* Photo block */}
      <div
        className={`relative overflow-hidden bg-[var(--surface-2)] ${
          featured ? 'aspect-[16/10]' : 'aspect-[4/3]'
        }`}
      >
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-faint)]">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Subtle gradient on hover for overlay legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quality tier badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center font-mono text-[10px] font-bold tracking-wider px-2 py-1 rounded-full shadow-sm ${tier.classes}`}
          >
            {tier.label}
          </span>
        </div>

        {/* Favorite button — top right, placeholder */}
        <button
          type="button"
          aria-label="Save"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[var(--text)] hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* View details arrow reveal on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-white">
            View details
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Info block */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[var(--text)] leading-tight line-clamp-1">
            {listing.year} {listing.make} {listing.model}
          </h3>
        </div>

        {/* Price — mono, emphasized */}
        <p className="font-mono text-xl font-bold text-[var(--text)] tracking-tight">
          ${listing.price_usd.toLocaleString()}
          <span className="ml-1 text-xs font-sans font-medium text-[var(--text-muted)]">USD</span>
        </p>

        {/* Specs line */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="font-mono">{listing.mileage_km.toLocaleString()} km</span>
          <span className="text-[var(--border)]">·</span>
          <span className="capitalize">{listing.fuel_type}</span>
          <span className="text-[var(--border)]">·</span>
          <span className="capitalize">{listing.transmission}</span>
        </div>

        {/* Footer row: location + meta */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{listing.location_city}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-faint)]">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views}
            </span>
            <span>{timeAgo(listing.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
