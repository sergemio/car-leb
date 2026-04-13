'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Listing, ListingPhoto, PhotoSlotName } from '@/types';

// Cars & Bids-style featured showcase: large hero photo left + mosaic right.
// Auto-rotates between listings every 6 seconds. Clicking any photo
// navigates to the listing detail page. Title/price/mileage overlaid
// on the hero photo bottom-left.

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

interface FeaturedShowcaseProps {
  listings: ListingWithPhotos[];
}

// Pick photos in a good order: front as hero, then structured angles
const SLOT_PRIORITY: PhotoSlotName[] = ['front', 'rear_quarter', 'front_quarter', 'dashboard', 'rear', 'left_side', 'seats', 'engine'];

function getOrderedPhotos(photos: ListingPhoto[]): ListingPhoto[] {
  const bySlot = new Map(photos.map(p => [p.slot, p]));
  const ordered: ListingPhoto[] = [];
  for (const slot of SLOT_PRIORITY) {
    const p = bySlot.get(slot);
    if (p) ordered.push(p);
  }
  // Add any remaining photos not in priority list
  for (const p of photos) {
    if (!ordered.includes(p)) ordered.push(p);
  }
  return ordered;
}

export function FeaturedShowcase({ listings }: FeaturedShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const rotate = useCallback(() => {
    if (listings.length <= 1) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(i => (i + 1) % listings.length);
      setTransitioning(false);
    }, 300);
  }, [listings.length]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (listings.length <= 1) return;
    const timer = setInterval(rotate, 6000);
    return () => clearInterval(timer);
  }, [rotate, listings.length]);

  if (listings.length === 0) return null;

  const listing = listings[activeIndex];
  const photos = getOrderedPhotos(listing.listing_photos);
  const heroPhoto = photos[0];
  const mosaicPhotos = photos.slice(1, 5); // 4 mosaic photos

  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)] flex items-center gap-3">
            <span className="w-7 h-px bg-[var(--ink)]" />
            Featured
          </div>
          {/* Dots indicator */}
          {listings.length > 1 && (
            <div className="flex items-center gap-2">
              {listings.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setTransitioning(true); setTimeout(() => { setActiveIndex(i); setTransitioning(false); }, 300); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'bg-[var(--ink)] scale-110'
                      : 'bg-[var(--gray-3)] hover:bg-[var(--gray-4)]'
                  }`}
                  aria-label={`Show listing ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mosaic grid */}
        <div
          className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          <Link href={`/listings/${listing.id}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-2 lg:gap-2 lg:h-[420px]">
              {/* Hero photo — fills the full grid height */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full rounded-xl lg:rounded-l-xl lg:rounded-r-none overflow-hidden bg-[var(--gray-1)] group">
                {heroPhoto ? (
                  <img
                    src={heroPhoto.url}
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[11px] text-[var(--gray-3)]">No photo</span>
                  </div>
                )}

                {/* Overlay info — bottom left */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-mono text-lg font-bold text-white">
                      ${listing.price_usd.toLocaleString()}
                    </span>
                    <span className="font-mono text-[11px] text-white/70 uppercase tracking-[0.08em]">
                      {listing.mileage_km.toLocaleString()} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Mosaic — 2x2 grid, same height as hero */}
              <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-2 h-full">
                {[0, 1, 2, 3].map(i => {
                  const photo = mosaicPhotos[i];
                  return (
                    <div
                      key={i}
                      className={`overflow-hidden bg-[var(--gray-1)] group ${
                        i === 1 ? 'rounded-tr-xl' : i === 3 ? 'rounded-br-xl' : ''
                      }`}
                    >
                      {photo ? (
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center aspect-[4/3]">
                          <span className="font-mono text-[10px] text-[var(--gray-3)]">—</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
