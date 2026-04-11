'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Listing, ListingPhoto, QualityTier } from '@/types';

interface ListingCardProps {
  listing: Listing & { listing_photos: ListingPhoto[] };
  featured?: boolean;
}

// Quality tier labels — minimal text chips with a single emoji icon
const TIER_LABEL: Record<QualityTier, string> = {
  poor:  '🔧 Poor',
  fair:  '⚙️ Fair',
  good:  '🏁 Good',
  prime: '🏆 Prime',
};

// Compact ref number — 3-digit reference like "Ref. 018"
function getRef(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const n = Math.abs(hash) % 999;
  return n.toString().padStart(3, '0');
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const mainPhoto =
    listing.listing_photos.find((p) => p.slot === 'front') || listing.listing_photos[0];
  const tierLabel = TIER_LABEL[listing.quality_tier];
  const ref = getRef(listing.id);
  const cardRef = useRef<HTMLAnchorElement>(null);

  // RPM cooldown: when mouse leaves, re-trigger the animation keyframe
  // by removing and re-adding the class (force reflow).
  // See design-language.md §7 "Card hover (RPM cooldown)"
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.remove('cooling');
    // Force reflow so the animation restarts from 0%
    void card.offsetWidth;
    card.classList.add('cooling');
  };

  const handleAnimationEnd = () => {
    cardRef.current?.classList.remove('cooling');
  };

  return (
    <Link
      ref={cardRef}
      href={`/listings/${listing.id}`}
      onMouseLeave={handleMouseLeave}
      onAnimationEnd={handleAnimationEnd}
      className="group card-interactive relative block bg-white border border-[var(--gray-2)] rounded-2xl overflow-hidden transition-transform duration-[260ms] hover:-translate-y-0.5 hover:border-[var(--rpm-green)] hover:shadow-[0_0_0_1px_var(--rpm-green),_0_18px_40px_-16px_rgba(34,197,94,0.35)]"
    >
      {/* Photo block */}
      <div
        className={`relative bg-[var(--gray-1)] border-b border-[var(--gray-2)] overflow-hidden ${
          featured ? 'aspect-[16/10]' : 'aspect-[4/3]'
        }`}
      >
        {mainPhoto ? (
          <img
            src={mainPhoto.url}
            alt={`${listing.year} ${listing.make} ${listing.model}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          // Line-art silhouette placeholder
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-[70%] h-auto">
              <line x1="20" y1="160" x2="380" y2="160" stroke="#0A0A0A" strokeWidth="0.6" />
              <path
                d="M30 160 Q50 130 90 120 L160 108 Q220 95 300 105 L350 120 Q370 135 378 155 L378 160 Z"
                stroke="#0A0A0A"
                fill="none"
                strokeWidth="1"
              />
              <path
                d="M130 115 Q180 60 260 58 Q310 60 340 105"
                stroke="#0A0A0A"
                fill="none"
                strokeWidth="1"
              />
              <circle cx="110" cy="160" r="22" stroke="#0A0A0A" fill="none" strokeWidth="1" />
              <circle cx="110" cy="160" r="12" stroke="#0A0A0A" fill="none" strokeWidth="0.6" />
              <circle cx="300" cy="160" r="22" stroke="#0A0A0A" fill="none" strokeWidth="1" />
              <circle cx="300" cy="160" r="12" stroke="#0A0A0A" fill="none" strokeWidth="0.6" />
            </svg>
          </div>
        )}

        {/* Quality chip — top left */}
        <span className="absolute top-3.5 left-3.5 inline-flex items-center px-3 py-1.5 bg-white border border-[var(--ink)] rounded-full font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--ink)]">
          {tierLabel}
        </span>

        {/* Reference number — bottom right */}
        <span className="absolute bottom-3.5 right-3.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--gray-4)]">
          Ref. {ref}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 pt-5 pb-6">
        <h3 className="font-display text-xl font-medium text-[var(--ink)] tracking-tight line-clamp-1">
          {listing.year} {listing.make} {listing.model}
        </h3>

        <div className="flex items-end justify-between gap-4 mt-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--gray-4)] mb-1">
              Current bid
            </div>
            <div className="font-mono text-[22px] font-bold text-[var(--ink)] leading-none tracking-tight">
              ${listing.price_usd.toLocaleString()}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="px-5 py-2.5 bg-[var(--ink)] text-white text-[13px] font-medium rounded-full hover:bg-[var(--gray-4)] transition-colors"
          >
            Place bid
          </button>
        </div>
      </div>
    </Link>
  );
}
