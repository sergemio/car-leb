'use client';

import { useRef } from 'react';
import { PhotoSlotState } from '@/types';

// Single photo upload slot — minimal, hairline border, mono label
// Filled state: hairline ink border; empty state: dashed gray border, hover ink

interface PhotoSlotProps {
  slot: PhotoSlotState;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export function PhotoSlot({ slot, onFileSelect, onRemove }: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--gray-4)]">
        {slot.label}
        {slot.required && <span className="text-[var(--ink)] ml-1">*</span>}
      </span>

      {slot.preview ? (
        <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-[var(--ink)] bg-[var(--gray-1)]">
          <img
            src={slot.preview}
            alt={slot.label}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[var(--ink)] flex items-center justify-center text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="group relative aspect-[4/3] rounded-xl border border-dashed border-[var(--gray-2)] bg-white hover:border-[var(--ink)] hover:bg-[var(--gray-1)] transition-colors overflow-hidden cursor-pointer"
        >
          <img
            src={`/sketches/guides/${slot.slot}.png`}
            alt={`${slot.label} reference`}
            className="absolute inset-0 w-full h-full object-contain p-2"
            draggable={false}
          />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--gray-4)] bg-white/80 px-2 py-0.5 rounded-full group-hover:text-[var(--ink)] transition-colors">
            + Add photo
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
