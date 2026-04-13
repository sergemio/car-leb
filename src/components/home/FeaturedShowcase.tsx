'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Listing, ListingPhoto, PhotoSlotName } from '@/types';

// Cars & Bids-style featured showcase:
// - Hero photo (wide, ~65%) with FEATURED badge top-left,
//   title/year/specs top-right overlay
// - Right column: 2 landscape photos stacked + "All Photos (N)" link
// - Compact height (~300px), auto-rotates between listings

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

interface FeaturedShowcaseProps {
  listings: ListingWithPhotos[];
}

const SLOT_PRIORITY: PhotoSlotName[] = ['front', 'rear_quarter', 'front_quarter', 'dashboard', 'rear', 'left_side', 'seats', 'engine'];

function getOrderedPhotos(photos: ListingPhoto[]): ListingPhoto[] {
  const bySlot = new Map(photos.map(p => [p.slot, p]));
  const ordered: ListingPhoto[] = [];
  for (const slot of SLOT_PRIORITY) {
    const p = bySlot.get(slot);
    if (p) ordered.push(p);
  }
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

  useEffect(() => {
    if (listings.length <= 1) return;
    const timer = setInterval(rotate, 6000);
    return () => clearInterval(timer);
  }, [rotate, listings.length]);

  if (listings.length === 0) return null;

  const listing = listings[activeIndex];
  const photos = getOrderedPhotos(listing.listing_photos);
  const heroPhoto = photos[0];
  const sidePhotos = photos.slice(1, 4); // 3 side photos
  const totalPhotos = listing.listing_photos.length;

  return (
    <section>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-6">
        {/* Dots indicator — minimal, above the mosaic */}
        {listings.length > 1 && (
          <div className="flex items-center gap-1.5 mb-3 justify-end">
            {listings.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setTransitioning(true); setTimeout(() => { setActiveIndex(i); setTransitioning(false); }, 300); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-[var(--ink)]' : 'bg-[var(--gray-3)]'
                }`}
                aria-label={`Show listing ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mosaic */}
        <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Link href={`/listings/${listing.id}`} className="block">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-1.5 lg:h-[320px]">

              {/* Hero photo — large, landscape */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full rounded-lg overflow-hidden bg-[var(--gray-1)] group">
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

                {/* FEATURED badge — top left */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--rpm-green)] text-white font-mono text-[10px] font-bold uppercase tracking-[0.1em] rounded">
                  Featured
                </span>

                {/* Title overlay — top right */}
                <div className="absolute top-0 right-0 p-4 text-right">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <p className="font-mono text-[11px] text-white/80 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {listing.mileage_km.toLocaleString()} km · {listing.transmission} · {listing.fuel_type}
                  </p>
                </div>

                {/* Price — bottom left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded font-mono text-[15px] font-bold text-white">
                    ${listing.price_usd.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right column — 3 landscape photos stacked */}
              <div className="hidden lg:flex lg:flex-col gap-1.5 h-full">
                {[0, 1].map(i => {
                  const photo = sidePhotos[i];
                  return (
                    <div
                      key={i}
                      className={`flex-1 overflow-hidden bg-[var(--gray-1)] ${
                        i === 0 ? 'rounded-tr-lg' : ''
                      }`}
                    >
                      {photo ? (
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-mono text-[10px] text-[var(--gray-3)]">—</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* "All Photos" cell — bottom right */}
                <div className="flex-1 overflow-hidden bg-[var(--gray-1)] rounded-br-lg relative">
                  {sidePhotos[2] ? (
                    <>
                      <img
                        src={sidePhotos[2].url}
                        alt=""
                        className="w-full h-full object-cover brightness-50"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[12px] font-medium text-white uppercase tracking-[0.08em]">
                          All Photos ({totalPhotos})
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-[11px] text-[var(--gray-4)]">
                        All Photos ({totalPhotos})
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
