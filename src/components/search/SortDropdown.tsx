'use client';

import { ListingFilters } from '@/types';

interface SortDropdownProps {
  value: ListingFilters['sort_by'];
  onChange: (value: ListingFilters['sort_by']) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'mileage_asc', label: 'Mileage: low to high' },
  { value: 'score_desc', label: 'Best listings' },
] as const;

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ListingFilters['sort_by'])}
      className="px-4 h-9 border border-[var(--gray-2)] rounded-full font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink)] bg-white outline-none hover:border-[var(--ink)] focus:border-[var(--ink)] transition-colors appearance-none pr-9"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%230A0A0A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        backgroundSize: '10px 7px',
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
