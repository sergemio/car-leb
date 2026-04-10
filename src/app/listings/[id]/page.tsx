import { createServerSupabase } from '@/lib/supabase-server';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Listing, ListingPhoto } from '@/types';
import { PHOTO_SLOTS } from '@/lib/constants';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('id', id)
    .single();

  if (error || !listing) return notFound();

  const typedListing = listing as Listing & { listing_photos: ListingPhoto[] };

  const photosBySlot = new Map(
    typedListing.listing_photos.map(p => [p.slot, p])
  );

  const whatsappNumber = typedListing.seller_whatsapp || typedListing.seller_phone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi, I'm interested in your ${typedListing.year} ${typedListing.make} ${typedListing.model} listed on Car Leb.`
      )}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {typedListing.year} {typedListing.make} {typedListing.model}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {typedListing.location_city}, {typedListing.location_region}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">
            ${typedListing.price_usd.toLocaleString()}
          </p>
          <Badge variant={typedListing.quality_tier}>
            {typedListing.quality_tier.charAt(0).toUpperCase() + typedListing.quality_tier.slice(1)} Listing
          </Badge>
        </div>
      </div>

      {/* Photo grid */}
      <div className="mb-8">
        {photosBySlot.has('front') && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3">
            <img
              src={photosBySlot.get('front')!.url}
              alt="Front view"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PHOTO_SLOTS.filter(s => s.slot !== 'front').map(slot => {
            const photo = photosBySlot.get(slot.slot);
            return (
              <div key={slot.slot} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                {photo ? (
                  <img
                    src={photo.url}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs mt-1">{slot.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Year', value: typedListing.year },
                { label: 'Mileage', value: `${typedListing.mileage_km.toLocaleString()} km` },
                { label: 'Fuel', value: typedListing.fuel_type },
                { label: 'Transmission', value: typedListing.transmission },
                { label: 'Condition', value: typedListing.condition },
                { label: 'Location', value: `${typedListing.location_city}, ${typedListing.location_region}` },
              ].map(spec => (
                <div key={spec.label}>
                  <p className="text-xs text-gray-500 uppercase">{spec.label}</p>
                  <p className="font-medium text-gray-900 capitalize">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {typedListing.description && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{typedListing.description}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Listing Completeness</p>
            <ProgressBar value={typedListing.completeness_score} />
          </div>
        </div>

        {/* Contact card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Contact Seller</h2>
            <p className="text-sm text-gray-600">{typedListing.seller_name}</p>

            {typedListing.seller_phone && (
              <a
                href={`tel:${typedListing.seller_phone}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Call
              </a>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
