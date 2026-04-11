import { ListingCard } from './ListingCard';
import { Listing, ListingPhoto } from '@/types';

interface ListingGridProps {
  listings: (Listing & { listing_photos: ListingPhoto[] })[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-[var(--gray-2)] rounded-2xl">
        <p className="font-display text-2xl text-[var(--ink)]">No listings found.</p>
        <p className="text-sm text-[var(--gray-4)] mt-2">
          Try adjusting your filters or check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
