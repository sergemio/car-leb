import { QualityTier, PhotoSlotName } from '@/types';
import { PHOTO_SLOTS } from './constants';

// Completeness score: 0-100, drives listing visibility in search
// Why this scoring: incentivizes sellers to provide quality info + photos
//
// Breakdown:
//   Essential fields filled:   up to 30 points
//   Required photo slots (8):  up to 50 points (6.25 each)
//   Description provided:      up to 10 points
//   Optional photo bonus:      up to 10 points (capped at 100 total)

interface CompletenessInput {
  make: string;
  model: string;
  year: number | null;
  price_usd: number | null;
  mileage_km: number | null;
  fuel_type: string;
  transmission: string;
  condition: string;
  location_city: string;
  location_region: string;
  description: string;
}

interface CompletenessResult {
  score: number;
  tier: QualityTier;
}

export function calculateCompleteness(
  fields: CompletenessInput,
  filledSlots: PhotoSlotName[]
): CompletenessResult {
  let score = 0;

  // Essential fields: 30 points total (3 points each, 10 fields)
  const essentialFields = [
    fields.make, fields.model, fields.year, fields.price_usd,
    fields.mileage_km, fields.fuel_type, fields.transmission,
    fields.condition, fields.location_city, fields.location_region,
  ];
  const filledFields = essentialFields.filter(f => f !== null && f !== '' && f !== undefined);
  score += Math.round((filledFields.length / essentialFields.length) * 30);

  // Required photo slots: 50 points total
  const requiredSlots = PHOTO_SLOTS.filter(s => s.required);
  const filledRequired = requiredSlots.filter(s => filledSlots.includes(s.slot));
  score += Math.round((filledRequired.length / requiredSlots.length) * 50);

  // Description: 10 points if provided (at least 10 chars)
  if (fields.description && fields.description.length >= 10) {
    score += 10;
  }

  // Optional photo bonus: up to 10 points
  const optionalSlots = PHOTO_SLOTS.filter(s => !s.required);
  const filledOptional = optionalSlots.filter(s => filledSlots.includes(s.slot));
  if (optionalSlots.length > 0) {
    score += Math.round((filledOptional.length / optionalSlots.length) * 10);
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Derive tier
  const tier: QualityTier = score >= 80 ? 'gold' : score >= 50 ? 'silver' : 'bronze';

  return { score, tier };
}
