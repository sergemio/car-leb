import { createServerSupabase } from '@/lib/supabase-server';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Listing, ListingPhoto } from '@/types';
import { PHOTO_SLOTS } from '@/lib/constants';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// Listing detail page — editorial layout matching the rest of the site
// Header (mono eyebrow + display title) → hero photo (front) → grid of other slots
// → specs + description + contact card sticky on the right

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabase();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('id', id)
    .single();

  if (error || !listing) return notFound();

  const l = listing as Listing & { listing_photos: ListingPhoto[] };

  const photosBySlot = new Map(l.listing_photos.map((p) => [p.slot, p]));
  const frontPhoto = photosBySlot.get('front');

  const whatsappNumber = l.seller_whatsapp || l.seller_phone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi, I'm interested in your ${l.year} ${l.make} ${l.model} listed on Car Leb.`
      )}`
    : null;

  const TIER_LABELS: Record<typeof l.quality_tier, string> = {
    poor:  'Poor',
    fair:  'Fair',
    good:  'Good',
    prime: 'Prime',
  };
  const tierLabel = TIER_LABELS[l.quality_tier];

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gray-4)] mb-3 flex items-center gap-3">
            <span className="w-7 h-px bg-[var(--ink)]" />
            Ref. {l.id.slice(0, 8)}
          </div>
          <h1 className="font-display text-[56px] sm:text-[72px] font-black leading-[0.88] text-[var(--ink)]">
            {l.year} {l.make} <span className="font-light text-[var(--gray-3)]">{l.model}</span>
          </h1>
          <p className="text-[14px] text-[var(--gray-4)] mt-3">
            {l.location_city}, {l.location_region}
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0 space-y-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--gray-4)] mb-1">
              Asking
            </div>
            <div className="font-mono text-[36px] font-bold text-[var(--ink)] leading-none tabular-nums">
              ${l.price_usd.toLocaleString()}
            </div>
          </div>
          <Badge variant={l.quality_tier}>{tierLabel}</Badge>
        </div>
      </div>

      {/* Photo hero */}
      {frontPhoto && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-[var(--gray-2)] bg-[var(--gray-1)]">
          <img
            src={frontPhoto.url}
            alt={`${l.year} ${l.make} ${l.model}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Remaining photo slots grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {PHOTO_SLOTS.filter((s) => s.slot !== 'front').map((slot) => {
          const photo = photosBySlot.get(slot.slot);
          return (
            <div
              key={slot.slot}
              className="aspect-[4/3] rounded-xl overflow-hidden border border-[var(--gray-2)] bg-[var(--gray-1)]"
            >
              {photo ? (
                <img
                  src={photo.url}
                  alt={slot.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--gray-3)]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] mt-2">
                    {slot.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Details + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Specifications */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-5">
              — Specifications
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-8 border-b border-[var(--gray-2)]">
              {[
                { label: 'Year', value: l.year.toString() },
                { label: 'Mileage', value: `${l.mileage_km.toLocaleString()} km` },
                { label: 'Fuel', value: l.fuel_type },
                { label: 'Transmission', value: l.transmission },
                { label: 'Condition', value: l.condition },
                { label: 'Location', value: l.location_city },
              ].map((spec) => (
                <div key={spec.label}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--gray-4)] mb-1">
                    {spec.label}
                  </div>
                  <div className="text-[15px] text-[var(--ink)] capitalize font-medium">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {l.description && (
            <div className="pb-8 border-b border-[var(--gray-2)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-4">
                — Description
              </div>
              <p className="text-[15px] text-[var(--ink)] whitespace-pre-wrap leading-[1.6]">
                {l.description}
              </p>
            </div>
          )}

          {/* Completeness */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-3">
              — Listing completeness
            </div>
            <ProgressBar value={l.completeness_score} />
          </div>
        </div>

        {/* Contact card — sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-[var(--ink)] rounded-2xl p-6 space-y-4 shadow-[5px_5px_0_var(--ink)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
              — Contact seller
            </div>
            <h2 className="font-display text-[22px] font-medium text-[var(--ink)]">
              {l.seller_name}
            </h2>

            {l.seller_phone && (
              <a
                href={`tel:${l.seller_phone}`}
                className="w-full flex items-center justify-center gap-2 h-11 border border-[var(--ink)] rounded-full bg-transparent text-[var(--ink)] text-sm font-medium hover:bg-[var(--gray-1)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 h-11 border border-[var(--ink)] rounded-full bg-[var(--ink)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
