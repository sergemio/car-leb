'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { SortDropdown } from '@/components/search/SortDropdown';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { useListings } from '@/hooks/useListings';

export default function ListingsPage() {
  const { listings, loading, filters, setFilters, resetFilters } = useListings();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function handleSearch(make: string, model: string) {
    setFilters(prev => ({ ...prev, make, model }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} initialMake={filters.make} initialModel={filters.model} />
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`}
              </p>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Filters
              </button>
            </div>
            <SortDropdown
              value={filters.sort_by}
              onChange={sort_by => setFilters(prev => ({ ...prev, sort_by }))}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : (
            <ListingGrid listings={listings} />
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
