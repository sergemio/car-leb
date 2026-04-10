'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Listing, ListingPhoto, ListingFilters } from '@/types';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

const DEFAULT_FILTERS: ListingFilters = {
  make: '', model: '',
  year_min: null, year_max: null,
  price_min: null, price_max: null,
  mileage_max: null,
  fuel_type: '', transmission: '', condition: '',
  location_region: '',
  sort_by: 'newest',
};

export function useListings(initialFilters?: Partial<ListingFilters>) {
  const [filters, setFilters] = useState<ListingFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [listings, setListings] = useState<ListingWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  async function fetchListings() {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('listings')
        .select('*, listing_photos(*)')
        .eq('status', 'active');

      if (filters.make) query = query.eq('make', filters.make);
      if (filters.model) query = query.eq('model', filters.model);
      if (filters.year_min) query = query.gte('year', filters.year_min);
      if (filters.year_max) query = query.lte('year', filters.year_max);
      if (filters.price_min) query = query.gte('price_usd', filters.price_min);
      if (filters.price_max) query = query.lte('price_usd', filters.price_max);
      if (filters.mileage_max) query = query.lte('mileage_km', filters.mileage_max);
      if (filters.fuel_type) query = query.eq('fuel_type', filters.fuel_type);
      if (filters.transmission) query = query.eq('transmission', filters.transmission);
      if (filters.condition) query = query.eq('condition', filters.condition);
      if (filters.location_region) query = query.eq('location_region', filters.location_region);

      switch (filters.sort_by) {
        case 'price_asc':
          query = query.order('price_usd', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price_usd', { ascending: false });
          break;
        case 'mileage_asc':
          query = query.order('mileage_km', { ascending: true });
          break;
        case 'score_desc':
          query = query.order('completeness_score', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      query = query.limit(50);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setListings((data as ListingWithPhotos[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return { listings, loading, error, filters, setFilters, resetFilters };
}
