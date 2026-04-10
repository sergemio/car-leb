import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Listing, ListingPhoto } from '@/types';

interface ListingCardProps {
  listing: Listing & { listing_photos: ListingPhoto[] };
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainPhoto = listing.listing_photos.find(p => p.slot === 'front')
    || listing.listing_photos[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={listing.quality_tier}>
            {listing.quality_tier.charAt(0).toUpperCase() + listing.quality_tier.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {listing.year} {listing.make} {listing.model}
        </h3>
        <p className="text-lg font-bold text-blue-600">
          ${listing.price_usd.toLocaleString()}
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{listing.mileage_km.toLocaleString()} km</span>
          <span>·</span>
          <span className="capitalize">{listing.fuel_type}</span>
          <span>·</span>
          <span className="capitalize">{listing.transmission}</span>
        </div>
        <p className="text-xs text-gray-400">{listing.location_city}, {listing.location_region}</p>
      </div>
    </Link>
  );
}
