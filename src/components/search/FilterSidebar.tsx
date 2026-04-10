'use client';

import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { ListingFilters } from '@/types';
import { MAKE_NAMES, CAR_MAKES, FUEL_TYPES_LEBANON, REGIONS } from '@/lib/constants';

interface FilterSidebarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onReset: () => void;
}

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const availableModels = filters.make ? (CAR_MAKES[filters.make] || []) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <button onClick={onReset} className="text-sm text-blue-600 hover:underline">
          Reset
        </button>
      </div>

      <Select
        label="Make"
        options={MAKE_NAMES.map(m => ({ value: m, label: m }))}
        placeholder="Any make"
        value={filters.make}
        onChange={e => { update('make', e.target.value); update('model', ''); }}
      />

      <Select
        label="Model"
        options={availableModels.map(m => ({ value: m, label: m }))}
        placeholder="Any model"
        value={filters.model}
        onChange={e => update('model', e.target.value)}
        disabled={!filters.make}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Year from"
          type="number"
          placeholder="1990"
          value={filters.year_min ?? ''}
          onChange={e => update('year_min', e.target.value ? Number(e.target.value) : null)}
        />
        <Input
          label="Year to"
          type="number"
          placeholder="2026"
          value={filters.year_max ?? ''}
          onChange={e => update('year_max', e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Price min ($)"
          type="number"
          placeholder="0"
          value={filters.price_min ?? ''}
          onChange={e => update('price_min', e.target.value ? Number(e.target.value) : null)}
        />
        <Input
          label="Price max ($)"
          type="number"
          placeholder="Any"
          value={filters.price_max ?? ''}
          onChange={e => update('price_max', e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <Input
        label="Max mileage (km)"
        type="number"
        placeholder="Any"
        value={filters.mileage_max ?? ''}
        onChange={e => update('mileage_max', e.target.value ? Number(e.target.value) : null)}
      />

      <Select
        label="Fuel Type"
        options={FUEL_TYPES_LEBANON.map(f => ({ value: f.value, label: f.label }))}
        placeholder="Any"
        value={filters.fuel_type}
        onChange={e => update('fuel_type', e.target.value as any)}
      />

      <Select
        label="Transmission"
        options={[
          { value: 'automatic', label: 'Automatic' },
          { value: 'manual', label: 'Manual' },
        ]}
        placeholder="Any"
        value={filters.transmission}
        onChange={e => update('transmission', e.target.value as any)}
      />

      <Select
        label="Condition"
        options={[
          { value: 'new', label: 'New' },
          { value: 'used', label: 'Used' },
          { value: 'salvage', label: 'Salvage' },
        ]}
        placeholder="Any"
        value={filters.condition}
        onChange={e => update('condition', e.target.value as any)}
      />

      <Select
        label="Region"
        options={REGIONS.map(r => ({ value: r.region, label: r.region }))}
        placeholder="Any region"
        value={filters.location_region}
        onChange={e => update('location_region', e.target.value)}
      />
    </div>
  );
}
