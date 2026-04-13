import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PhotoGallery } from '@/components/listing/PhotoGallery';
import { ListingCard } from '@/components/listing/ListingCard';
import { Listing, ListingPhoto, PhotoSlotName } from '@/types';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

// Cars & Bids-style listing detail:
// 1. Title bar (name + subtitle)
// 2. Photo mosaic (hero left + 4 small right)
// 3. Two columns: specs/description left, contact + similar cars right

const MOSAIC_SLOTS: PhotoSlotName[] = ['rear_quarter', 'dashboard', 'front_quarter', 'seats'];

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabase();

  // Fetch listing + similar cars in parallel
  const [{ data: listing, error }, { data: similarRaw }] = await Promise.all([
    supabase
      .from('listings')
      .select('*, listing_photos(*)')
      .eq('id', id)
      .single(),
    supabase
      .from('listings')
      .select('*, listing_photos(*)')
      .eq('status', 'active')
      .neq('id', id)
      .order('completeness_score', { ascending: false })
      .limit(4),
  ]);

  if (error || !listing) return notFound();

  const l = listing as Listing & { listing_photos: ListingPhoto[] };
  const similar = (similarRaw as (Listing & { listing_photos: ListingPhoto[] })[]) || [];

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

  // Photo helpers
  const photosBySlot = new Map(l.listing_photos.map(p => [p.slot, p]));
  const heroPhoto = photosBySlot.get('front') || l.listing_photos[0];
  const mosaicPhotos = MOSAIC_SLOTS.map(s => photosBySlot.get(s)).filter(Boolean) as ListingPhoto[];
  // Fill remaining mosaic slots from other photos not already used
  const usedIds = new Set([heroPhoto?.id, ...mosaicPhotos.map(p => p.id)]);
  for (const p of l.listing_photos) {
    if (mosaicPhotos.length >= 4) break;
    if (!usedIds.has(p.id)) { mosaicPhotos.push(p); usedIds.add(p.id); }
  }

  return (
    <div>
      {/* ===== TITLE BAR ===== */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8 pb-4">
        <h1 className="font-display text-[32px] sm:text-[40px] font-black leading-[1] text-[var(--ink)]">
          {l.year} {l.make} {l.model}
        </h1>
        <p className="text-[14px] text-[var(--gray-4)] mt-1">
          {l.mileage_km.toLocaleString()} km · {l.fuel_type} · {l.transmission} · {l.location_city}, {l.location_region}
        </p>
      </div>

      {/* ===== PHOTO MOSAIC ===== */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-6">
        <PhotoGallery photos={l.listing_photos} title={`${l.year} ${l.make} ${l.model}`} />
      </div>

      {/* ===== MAIN CONTENT: 2 columns ===== */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* LEFT — Specs + Description + Completeness */}
          <div className="space-y-8">
            {/* Price + badge bar */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--gray-2)]">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[32px] font-bold text-[var(--ink)] tabular-nums">
                  ${l.price_usd.toLocaleString()}
                </span>
                <Badge variant={l.quality_tier}>{tierLabel}</Badge>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--gray-4)]">
                Ref. {l.id.slice(0, 8)}
              </div>
            </div>

            {/* Specifications — 2-column table like Cars & Bids */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-4">
                — Specifications
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                {[
                  { label: 'Make', value: l.make },
                  { label: 'Year', value: l.year.toString() },
                  { label: 'Model', value: l.model },
                  { label: 'Mileage', value: `${l.mileage_km.toLocaleString()} km` },
                  { label: 'Fuel', value: l.fuel_type },
                  { label: 'Transmission', value: l.transmission },
                  { label: 'Condition', value: l.condition },
                  { label: 'Location', value: `${l.location_city}, ${l.location_region}` },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between py-3 border-b border-[var(--gray-2)]">
                    <span className="text-[13px] text-[var(--gray-4)]">{spec.label}</span>
                    <span className="text-[13px] text-[var(--ink)] font-medium capitalize">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {l.description && (
              <div>
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

          {/* RIGHT — Contact + Similar */}
          <div className="space-y-8">
            {/* Contact card — sticky */}
            <div className="sticky top-[88px]">
              <div className="bg-white border border-[var(--ink)] rounded-2xl p-6 space-y-4 shadow-[5px_5px_0_var(--ink)]">
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

              {/* Similar cars */}
              {similar.length > 0 && (
                <div className="mt-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-4 flex items-center gap-3">
                    <span className="w-7 h-px bg-[var(--ink)]" />
                    Similar cars
                  </div>
                  <div className="space-y-3">
                    {similar.slice(0, 3).map(s => {
                      const photo = s.listing_photos.find(p => p.slot === 'front') || s.listing_photos[0];
                      return (
                        <Link
                          key={s.id}
                          href={`/listings/${s.id}`}
                          className="group flex gap-3 p-2 border border-[var(--gray-2)] rounded-xl hover:border-[var(--rpm-green)] hover:shadow-[0_0_0_1px_var(--rpm-green)] transition-all duration-200"
                        >
                          <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--gray-1)]">
                            {photo ? (
                              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="text-[13px] font-medium text-[var(--ink)] truncate">
                              {s.year} {s.make} {s.model}
                            </span>
                            <span className="font-mono text-[13px] font-bold text-[var(--ink)] mt-0.5">
                              ${s.price_usd.toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
