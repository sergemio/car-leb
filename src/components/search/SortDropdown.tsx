'use client';

import { ListingFilters } from '@/types';

interface SortDropdownProps {
  value: ListingFilters['sort_by'];
  onChange: (value: ListingFilters['sort_by']) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'mileage_asc', label: 'Mileage: Low to High' },
  { value: 'score_desc', label: 'Best listings' },
] as const;

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as ListingFilters['sort_by'])}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {SORT_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
