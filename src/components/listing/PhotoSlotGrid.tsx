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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Required Photos <span className="text-gray-400 font-normal">({requiredSlots.filter(s => s.preview).length}/{requiredSlots.length})</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slots.map((slot, i) =>
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
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Bonus Photos <span className="text-gray-400 font-normal">(optional — boosts your score)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slots.map((slot, i) =>
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
