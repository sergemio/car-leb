import { ListingCard } from './ListingCard';
import { Listing, ListingPhoto } from '@/types';

interface ListingGridProps {
  listings: (Listing & { listing_photos: ListingPhoto[] })[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No listings found.</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
