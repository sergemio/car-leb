'use client';

import { useState, useCallback, useEffect } from 'react';
import { ListingPhoto } from '@/types';
import { PHOTO_SLOTS } from '@/lib/constants';

// Cars & Bids-style photo gallery:
// Left: large hero photo (~60%, taller aspect ~4:3)
// Right: 2-column × 4-row grid = 8 cells (7 photos + "All Photos" last cell)
// Click any photo → fullscreen lightbox

interface PhotoGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const photosBySlot = new Map(photos.map((p) => [p.slot, p]));
  const frontPhoto = photosBySlot.get('front') || photos[0];

  const orderedPhotos: ListingPhoto[] = [];
  if (frontPhoto) orderedPhotos.push(frontPhoto);
  for (const slot of PHOTO_SLOTS) {
    if (slot.slot === 'front') continue;
    const p = photosBySlot.get(slot.slot);
    if (p) orderedPhotos.push(p);
  }

  // 7 side photos for the 2×4 grid (last cell = "All Photos")
  const sidePhotos = orderedPhotos.slice(1, 8);
  const totalPhotos = orderedPhotos.length;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = (photo: ListingPhoto) => {
    const i = orderedPhotos.findIndex((p) => p.id === photo.id);
    if (i >= 0) setLightboxIndex(i);
  };
  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % orderedPhotos.length));
  }, [orderedPhotos.length]);
  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + orderedPhotos.length) % orderedPhotos.length
    );
  }, [orderedPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, next, prev]);

  const active = lightboxIndex !== null ? orderedPhotos[lightboxIndex] : null;

  return (
    <>
      {/* ===== MOSAIC: hero left + 2×4 grid right ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-1 lg:h-[480px] mb-6">
        {/* Hero photo — large, ~4:3 feel */}
        {frontPhoto && (
          <button
            type="button"
            onClick={() => open(frontPhoto)}
            className="relative lg:h-full aspect-[4/3] lg:aspect-auto rounded-lg lg:rounded-l-lg lg:rounded-r-none overflow-hidden bg-[var(--gray-1)] cursor-zoom-in group"
          >
            <img
              src={frontPhoto.url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </button>
        )}

        {/* Right: 2 columns × 4 rows grid */}
        <div className="hidden lg:grid grid-cols-2 grid-rows-4 gap-1 h-full">
          {Array.from({ length: 8 }).map((_, i) => {
            const isLast = i === 7;
            const photo = sidePhotos[i];

            // Corner rounding
            const rounded = i === 1 ? 'rounded-tr-lg' : i === 7 ? 'rounded-br-lg' : '';

            if (isLast) {
              // "All Photos" cell
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { if (orderedPhotos.length > 0) setLightboxIndex(0); }}
                  className={`overflow-hidden bg-[var(--gray-1)] ${rounded} relative cursor-zoom-in`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover brightness-[0.4]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[11px] font-medium text-white uppercase tracking-[0.08em]">
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
                </button>
              );
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => photo && open(photo)}
                className={`overflow-hidden bg-[var(--gray-1)] ${rounded} cursor-zoom-in group`}
              >
                {photo ? (
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[10px] text-[var(--gray-3)]">—</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: horizontal scroll strip */}
      {orderedPhotos.length > 1 && (
        <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
          {orderedPhotos.slice(1).map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => open(photo)}
              className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-[var(--gray-1)] cursor-zoom-in"
            >
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {active && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[var(--ink)]/95 backdrop-blur-sm flex flex-col"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex items-center justify-between px-6 py-5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(orderedPhotos.length).padStart(2, '0')}
              <span className="mx-3 text-white/30">·</span>
              {active.slot.replace(/_/g, ' ')}
            </span>
            <button
              type="button"
              onClick={close}
              className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center transition-colors"
              aria-label="Close gallery"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-16">
            <img
              src={active.url}
              alt={active.slot}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {orderedPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/30 hover:border-white text-white items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/30 hover:border-white text-white items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {orderedPhotos.length > 1 && (
            <div
              className="px-4 sm:px-6 py-4 overflow-x-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 justify-center min-w-max mx-auto">
                {orderedPhotos.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`w-16 h-12 rounded-md overflow-hidden border transition-all ${
                      i === lightboxIndex
                        ? 'border-white opacity-100 scale-105'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                    aria-label={`Go to photo ${i + 1}`}
                  >
                    <img src={p.url} alt={p.slot} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
