'use client';

import { useState, useCallback } from 'react';
import { PhotoSlot } from './PhotoSlot';
import { PhotoSlotState, PhotoSlotName } from '@/types';
import { PHOTO_SLOTS } from '@/lib/constants';
import { createPreviewUrl, revokePreviewUrl } from '@/lib/compression';

interface PhotoSlotGridProps {
  onSlotsChange: (slots: PhotoSlotState[]) => void;
}

function initializeSlots(): PhotoSlotState[] {
  return PHOTO_SLOTS.map(s => ({
    slot: s.slot,
    label: s.label,
    file: null,
    preview: null,
    uploaded_url: null,
    required: s.required,
  }));
}

export function PhotoSlotGrid({ onSlotsChange }: PhotoSlotGridProps) {
  const [slots, setSlots] = useState<PhotoSlotState[]>(initializeSlots);

  const handleFileSelect = useCallback((index: number, file: File) => {
    setSlots(prev => {
      const updated = [...prev];
      if (updated[index].preview) {
        revokePreviewUrl(updated[index].preview!);
      }
      updated[index] = {
        ...updated[index],
        file,
        preview: createPreviewUrl(file),
      };
      onSlotsChange(updated);
      return updated;
    });
  }, [onSlotsChange]);

  const handleRemove = useCallback((index: number) => {
    setSlots(prev => {
      const updated = [...prev];
      if (updated[index].preview) {
        revokePreviewUrl(updated[index].preview!);
      }
      updated[index] = {
        ...updated[index],
        file: null,
        preview: null,
        uploaded_url: null,
      };
      onSlotsChange(updated);
      return updated;
    });
  }, [onSlotsChange]);

  const requiredSlots = slots.filter(s => s.required);
  const optionalSlots = slots.filter(s => !s.required);

  const filledRequired = requiredSlots.filter((s) => s.preview).length;

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
            — Required photos
          </h3>
          <span className="font-mono text-[11px] tabular-nums text-[var(--ink)]">
            {filledRequired.toString().padStart(2, '0')} / {requiredSlots.length.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {slots.map(
            (slot, i) =>
              slot.required && (
                <PhotoSlot
                  key={slot.slot}
                  slot={slot}
                  onFileSelect={(file) => handleFileSelect(i, file)}
                  onRemove={() => handleRemove(i)}
                />
              )
          )}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
            — Bonus photos
          </h3>
          <span className="font-mono text-[10px] text-[var(--gray-3)]">
            Optional — boosts your score
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {slots.map(
            (slot, i) =>
              !slot.required && (
                <PhotoSlot
                  key={slot.slot}
                  slot={slot}
                  onFileSelect={(file) => handleFileSelect(i, file)}
                  onRemove={() => handleRemove(i)}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
}
