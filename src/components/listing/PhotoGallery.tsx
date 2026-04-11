'use client';

import { useState, useCallback, useEffect } from 'react';
import { ListingPhoto } from '@/types';
import { PHOTO_SLOTS } from '@/lib/constants';

// Gallery for the listing detail page.
// - Hero front photo + grid of other slots
// - Clicking any filled photo opens a fullscreen lightbox
// - In the lightbox: arrow keys, clickable prev/next, ESC to close,
//   click on backdrop to close, thumbnail strip at the bottom
// Server component (page.tsx) passes the already-joined photos; we only
// need this to be a client component because of the lightbox state.

interface PhotoGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const photosBySlot = new Map(photos.map((p) => [p.slot, p]));
  const frontPhoto = photosBySlot.get('front');

  // Ordered list of photos that actually exist, front first.
  // This is what the lightbox navigates through.
  const orderedPhotos: ListingPhoto[] = [];
  if (frontPhoto) orderedPhotos.push(frontPhoto);
  for (const slot of PHOTO_SLOTS) {
    if (slot.slot === 'front') continue;
    const p = photosBySlot.get(slot.slot);
    if (p) orderedPhotos.push(p);
  }

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

  // Keyboard navigation + lock body scroll while open
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
      {/* Hero front photo */}
      {frontPhoto && (
        <button
          type="button"
          onClick={() => open(frontPhoto)}
          className="group block w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-[var(--gray-2)] bg-[var(--gray-1)] cursor-zoom-in"
          aria-label="Open photo gallery"
        >
          <img
            src={frontPhoto.url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>
      )}

      {/* Remaining photo slots grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {PHOTO_SLOTS.filter((s) => s.slot !== 'front').map((slot) => {
          const photo = photosBySlot.get(slot.slot);
          const common =
            'aspect-[4/3] rounded-xl overflow-hidden border border-[var(--gray-2)] bg-[var(--gray-1)]';
          if (photo) {
            return (
              <button
                key={slot.slot}
                type="button"
                onClick={() => open(photo)}
                className={`${common} group cursor-zoom-in`}
                aria-label={`Open ${slot.label}`}
              >
                <img
                  src={photo.url}
                  alt={slot.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </button>
            );
          }
          return (
            <div key={slot.slot} className={common}>
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--gray-3)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] mt-2">
                  {slot.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[var(--ink)]/95 backdrop-blur-sm flex flex-col"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Top bar — counter + close */}
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

          {/* Main image — clicking the backdrop (not the image) closes */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-16">
            <img
              src={active.url}
              alt={active.slot}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Prev / next buttons — desktop */}
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

          {/* Thumbnail strip */}
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
