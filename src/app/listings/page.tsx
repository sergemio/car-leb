'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { SortDropdown } from '@/components/search/SortDropdown';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { useListings } from '@/hooks/useListings';

// Browse page — same editorial rhythm as the homepage
// Left sidebar for filters on desktop, drawer on mobile

export default function ListingsPage() {
  const { listings, loading, filters, setFilters, resetFilters } = useListings();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function handleSearch(make: string, model: string) {
    setFilters((prev) => ({ ...prev, make, model }));
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
      {/* Eyebrow + title */}
      <div className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gray-4)] mb-4 flex items-center gap-3">
          <span className="w-7 h-px bg-[var(--ink)]" />
          Catalogue
        </div>
        <h1 className="font-display text-[72px] font-black leading-[0.88] text-[var(--ink)]">
          Browse all <span className="font-light text-[var(--gray-3)]">listings</span>.
        </h1>
      </div>

      {/* Search bar */}
      <div className="mb-10">
        <SearchBar
          onSearch={handleSearch}
          initialMake={filters.make}
          initialModel={filters.model}
        />
      </div>

      <div className="flex gap-10">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--gray-2)]">
            <div className="flex items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--gray-4)]">
                {loading
                  ? 'Loading…'
                  : `${listings.length.toString().padStart(2, '0')} listing${listings.length !== 1 ? 's' : ''}`}
              </p>
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink)] border border-[var(--ink)] rounded-full px-3 py-1.5"
              >
                Filters
              </button>
            </div>
            <SortDropdown
              value={filters.sort_by}
              onChange={(sort_by) => setFilters((prev) => ({ ...prev, sort_by }))}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[var(--gray-1)] border border-[var(--gray-2)] rounded-2xl aspect-[4/3] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ListingGrid listings={listings} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[var(--ink)]/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-xl border-l border-[var(--gray-2)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-[22px] font-medium text-[var(--ink)]">Filters</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="text-[var(--gray-4)] hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
