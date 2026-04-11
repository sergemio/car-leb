'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Listing, ListingPhoto } from '@/types';

interface EndingSoonProps {
  /** Listings used as fake auctions for now — we just overlay a countdown */
  listings: (Listing & { listing_photos: ListingPhoto[] })[];
}

// "Ending soon" section — placeholder auction UI on top of existing listings.
// Real auction backend comes later; for now we just show timers for that marketplace energy.
// Each card gets a deterministic end time based on its id so the countdown is stable per session.

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getFakeEndTime(id: string): number {
  const hash = hashId(id);
  // Fake auction ends between 1h and 48h from page load, deterministic per id
  const offsetMs = (1 + (hash % 48)) * 60 * 60 * 1000;
  return Date.now() + offsetMs;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'ENDED';
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function Countdown({ endTime }: { endTime: number }) {
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(endTime - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const urgent = remaining < 60 * 60 * 1000; // under an hour

  return (
    <span
      className={`font-mono text-sm font-bold ${
        urgent ? 'text-[var(--danger)]' : 'text-[var(--text)]'
      }`}
    >
      {formatRemaining(remaining)}
    </span>
  );
}

export function EndingSoon({ listings }: EndingSoonProps) {
  if (listings.length === 0) return null;

  const items = listings.slice(0, 4);

  return (
    <section className="border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-[var(--danger)] mb-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--danger)] opacity-75 live-dot" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--danger)]" />
              </span>
              ENDING SOON
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text)]">
              Auctions <em className="italic text-[var(--text-muted)]">in progress</em>
            </h2>
            <p className="text-[var(--text-muted)] mt-2 text-sm">
              Real-time bidding on hand-picked cars. Anti-sniping built in.
            </p>
          </div>
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-mono font-semibold text-[var(--text)] hover:text-[var(--lime-ink)] transition-colors group"
          >
            See all auctions
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Auction grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((listing, idx) => {
            const photo =
              listing.listing_photos.find((p) => p.slot === 'front') ||
              listing.listing_photos[0];
            const endTime = getFakeEndTime(listing.id);
            const fakeBid = Math.round((listing.price_usd * 0.85) / 100) * 100;
            const bidCount = 3 + (hashId(listing.id) % 24);

            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className={`group block bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--text)] transition-all reveal reveal-${idx + 1}`}
              >
                {/* Photo with timer overlay */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-2)]">
                  {photo ? (
                    <img
                      src={photo.url}
                      alt={`${listing.year} ${listing.make} ${listing.model}`}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}

                  {/* Timer chip */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-sm">
                    <svg className="w-3.5 h-3.5 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <Countdown endTime={endTime} />
                  </div>

                  {/* Bids count */}
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--lime)] text-[var(--lime-ink)] text-[10px] font-mono font-bold">
                    {bidCount} BIDS
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-[var(--text)] line-clamp-1">
                    {listing.year} {listing.make} {listing.model}
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        Current bid
                      </div>
                      <div className="font-mono text-xl font-bold text-[var(--text)]">
                        ${fakeBid.toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="px-4 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-semibold hover:brightness-110 transition-all"
                    >
                      Place bid
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
