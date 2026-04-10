'use client';

import { useRef } from 'react';
import { PhotoSlotState } from '@/types';

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
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">
        {slot.label}
        {slot.required && <span className="text-red-500 ml-0.5">*</span>}
      </span>

      {slot.preview ? (
        <div className="relative group aspect-[4/3] rounded-lg overflow-hidden border-2 border-green-400">
          <img
            src={slot.preview}
            alt={slot.label}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            x
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs text-gray-400">Add photo</span>
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
