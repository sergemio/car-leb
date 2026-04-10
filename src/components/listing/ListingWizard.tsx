'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PhotoSlotGrid } from './PhotoSlotGrid';
import { CompletenessScore } from './CompletenessScore';
import { calculateCompleteness } from '@/lib/completeness';
import { supabase } from '@/lib/supabase-client';
import { compressImage } from '@/lib/compression';
import { ListingFormData, PhotoSlotState, PhotoSlotName } from '@/types';
import {
  CAR_MAKES, MAKE_NAMES, YEARS, FUEL_TYPES_LEBANON, REGIONS,
} from '@/lib/constants';

const INITIAL_FORM: ListingFormData = {
  make: '', model: '', year: null, price_usd: null, mileage_km: null,
  fuel_type: '', transmission: '', condition: '',
  location_city: '', location_region: '',
  description: '', seller_name: '', seller_phone: '', seller_whatsapp: '',
};

export function ListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ListingFormData>(INITIAL_FORM);
  const [photoSlots, setPhotoSlots] = useState<PhotoSlotState[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableModels = form.make ? (CAR_MAKES[form.make] || []) : [];
  const availableCities = form.location_region
    ? [...(REGIONS.find(r => r.region === form.location_region)?.cities || [])]
    : [];

  const filledSlots = photoSlots
    .filter(s => s.preview !== null)
    .map(s => s.slot);

  const { score, tier } = useMemo(
    () => calculateCompleteness(form, filledSlots),
    [form, filledSlots]
  );

  function updateField<K extends keyof ListingFormData>(key: K, value: ListingFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const handleSlotsChange = useCallback((slots: PhotoSlotState[]) => {
    setPhotoSlots(slots);
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
          make: form.make,
          model: form.model,
          year: form.year,
          price_usd: form.price_usd,
          mileage_km: form.mileage_km,
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          condition: form.condition,
          location_city: form.location_city,
          location_region: form.location_region,
          description: form.description,
          seller_name: form.seller_name || 'Anonymous',
          seller_phone: form.seller_phone,
          seller_whatsapp: form.seller_whatsapp,
          completeness_score: score,
          quality_tier: tier,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Upload photos — continue even if individual uploads fail
      // Why: don't block the listing from being created because of one photo issue
      const slotsWithFiles = photoSlots.filter(s => s.file !== null);

      for (const slot of slotsWithFiles) {
        if (!slot.file) continue;

        try {
          const compressed = await compressImage(slot.file);

          const filePath = `${listing.id}/${slot.slot}.webp`;
          const { error: uploadError } = await supabase.storage
            .from('car-photos')
            .upload(filePath, compressed, {
              contentType: 'image/webp',
              upsert: true,
            });

          if (uploadError) {
            console.warn(`Photo upload failed for ${slot.slot}:`, uploadError.message);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('car-photos')
            .getPublicUrl(filePath);

          const { error: photoError } = await supabase
            .from('listing_photos')
            .insert({
              listing_id: listing.id,
              slot: slot.slot,
              url: publicUrl,
              display_order: 0,
            });

          if (photoError) {
            console.warn(`Photo record failed for ${slot.slot}:`, photoError.message);
          }
        } catch (photoErr) {
          console.warn(`Photo processing failed for ${slot.slot}:`, photoErr);
        }
      }

      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            <span className="text-sm text-gray-600 hidden sm:inline">
              {s === 1 ? 'Details' : s === 2 ? 'Photos' : 'Review'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <CompletenessScore score={score} tier={tier} />
      </div>

      {/* Step 1: Car Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Car Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Make"
              options={MAKE_NAMES.map(m => ({ value: m, label: m }))}
              placeholder="Select make..."
              value={form.make}
              onChange={e => {
                updateField('make', e.target.value);
                updateField('model', '');
              }}
            />
            <Select
              label="Model"
              options={availableModels.map(m => ({ value: m, label: m }))}
              placeholder={form.make ? 'Select model...' : 'Select make first'}
              value={form.model}
              onChange={e => updateField('model', e.target.value)}
              disabled={!form.make}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Year"
              options={YEARS.map(y => ({ value: String(y), label: String(y) }))}
              placeholder="Year..."
              value={form.year ? String(form.year) : ''}
              onChange={e => updateField('year', e.target.value ? Number(e.target.value) : null)}
            />
            <Input
              label="Price (USD)"
              type="number"
              placeholder="e.g. 25000"
              value={form.price_usd ?? ''}
              onChange={e => updateField('price_usd', e.target.value ? Number(e.target.value) : null)}
            />
            <Input
              label="Mileage (km)"
              type="number"
              placeholder="e.g. 50000"
              value={form.mileage_km ?? ''}
              onChange={e => updateField('mileage_km', e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Fuel Type"
              options={FUEL_TYPES_LEBANON.map(f => ({ value: f.value, label: f.label }))}
              placeholder="Select..."
              value={form.fuel_type}
              onChange={e => updateField('fuel_type', e.target.value as any)}
            />
            <Select
              label="Transmission"
              options={[
                { value: 'automatic', label: 'Automatic' },
                { value: 'manual', label: 'Manual' },
              ]}
              placeholder="Select..."
              value={form.transmission}
              onChange={e => updateField('transmission', e.target.value as any)}
            />
            <Select
              label="Condition"
              options={[
                { value: 'new', label: 'New' },
                { value: 'used', label: 'Used' },
                { value: 'salvage', label: 'Salvage' },
              ]}
              placeholder="Select..."
              value={form.condition}
              onChange={e => updateField('condition', e.target.value as any)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Region"
              options={REGIONS.map(r => ({ value: r.region, label: r.region }))}
              placeholder="Select region..."
              value={form.location_region}
              onChange={e => {
                updateField('location_region', e.target.value);
                updateField('location_city', '');
              }}
            />
            <Select
              label="City"
              options={availableCities.map(c => ({ value: c, label: c }))}
              placeholder={form.location_region ? 'Select city...' : 'Select region first'}
              value={form.location_city}
              onChange={e => updateField('location_city', e.target.value)}
              disabled={!form.location_region}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)}>Next: Photos</Button>
          </div>
        </div>
      )}

      {/* Step 2: Photos */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Photos</h2>
          <p className="text-sm text-gray-600">
            Upload photos from specific angles. The more slots you fill, the higher your listing ranks.
          </p>

          <PhotoSlotGrid onSlotsChange={handleSlotsChange} />

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next: Review</Button>
          </div>
        </div>
      )}

      {/* Step 3: Contact & Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact & Review</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              placeholder="e.g. Ali"
              value={form.seller_name}
              onChange={e => updateField('seller_name', e.target.value)}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. +961 71 123 456"
              value={form.seller_phone}
              onChange={e => updateField('seller_phone', e.target.value)}
            />
          </div>

          <Input
            label="WhatsApp Number (if different)"
            placeholder="e.g. +961 71 123 456"
            value={form.seller_whatsapp}
            onChange={e => updateField('seller_whatsapp', e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              placeholder="Tell buyers about your car — service history, modifications, reason for selling..."
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-800">Summary</h3>
            <p className="text-sm text-gray-600">
              {form.year} {form.make} {form.model} — ${form.price_usd?.toLocaleString()} — {form.mileage_km?.toLocaleString()} km
            </p>
            <p className="text-sm text-gray-600">
              {form.fuel_type} / {form.transmission} / {form.condition}
            </p>
            <p className="text-sm text-gray-600">
              {form.location_city}, {form.location_region}
            </p>
            <p className="text-sm text-gray-600">
              Photos: {photoSlots.filter(s => s.preview).length} uploaded
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit} loading={submitting}>
              Publish Listing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
