// Core types matching our Supabase schema
// Keep in sync with supabase/migrations/001_initial_schema.sql

export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type Transmission = 'automatic' | 'manual';
export type Condition = 'new' | 'used' | 'salvage';
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired';
export type QualityTier = 'bronze' | 'silver' | 'gold';

export type PhotoSlotName =
  | 'front' | 'rear' | 'left_side' | 'right_side'
  | 'front_quarter' | 'rear_quarter' | 'dashboard' | 'wheels'
  | 'engine' | 'trunk' | 'seats' | 'other';

export interface Listing {
  id: string;
  make: string;
  model: string;
  year: number;
  price_usd: number;
  mileage_km: number;
  fuel_type: FuelType;
  transmission: Transmission;
  condition: Condition;
  location_city: string;
  location_region: string;
  description: string;
  status: ListingStatus;
  completeness_score: number;
  quality_tier: QualityTier;
  seller_name: string;
  seller_phone: string;
  seller_whatsapp: string;
  created_at: string;
  updated_at: string;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  slot: PhotoSlotName;
  url: string;
  thumbnail_url: string;
  display_order: number;
  created_at: string;
}

// For the listing creation wizard — form state before DB insert
export interface ListingFormData {
  make: string;
  model: string;
  year: number | null;
  price_usd: number | null;
  mileage_km: number | null;
  fuel_type: FuelType | '';
  transmission: Transmission | '';
  condition: Condition | '';
  location_city: string;
  location_region: string;
  description: string;
  seller_name: string;
  seller_phone: string;
  seller_whatsapp: string;
}

// Photo slot with upload state
export interface PhotoSlotState {
  slot: PhotoSlotName;
  label: string;
  file: File | null;
  preview: string | null;
  uploaded_url: string | null;
  required: boolean;
}

// Search/filter state
export interface ListingFilters {
  make: string;
  model: string;
  year_min: number | null;
  year_max: number | null;
  price_min: number | null;
  price_max: number | null;
  mileage_max: number | null;
  fuel_type: FuelType | '';
  transmission: Transmission | '';
  condition: Condition | '';
  location_region: string;
  sort_by: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'score_desc';
}
