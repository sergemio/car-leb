import { QualityTier, PhotoSlotName } from '@/types';
import { PHOTO_SLOTS } from './constants';

// Completeness score: 0-100, drives listing visibility in search
// Why this scoring: incentivizes sellers to provide quality info + photos
//
// Breakdown:
//   Essential car fields (10):   up to 25 points (2.5 each)
//   Required photo slots (8):    up to 45 points
//   Seller contact (name+phone): up to 10 points (5 each)
//   Description (>=10 chars):    up to 10 points
//   Optional photo bonus:        up to 10 points
//   Total capped at 100.

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
  seller_name: string;
  seller_phone: string;
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

  // Essential car fields: 25 points total (10 fields, 2.5 each)
  const essentialFields = [
    fields.make, fields.model, fields.year, fields.price_usd,
    fields.mileage_km, fields.fuel_type, fields.transmission,
    fields.condition, fields.location_city, fields.location_region,
  ];
  const filledFields = essentialFields.filter(f => f !== null && f !== '' && f !== undefined);
  score += Math.round((filledFields.length / essentialFields.length) * 25);

  // Required photo slots: 45 points total
  const requiredSlots = PHOTO_SLOTS.filter(s => s.required);
  const filledRequired = requiredSlots.filter(s => filledSlots.includes(s.slot));
  score += Math.round((filledRequired.length / requiredSlots.length) * 45);

  // Seller contact: 10 points total (name + phone, 5 each).
  // Low thresholds so the rev counter reacts as soon as the user starts typing.
  if (fields.seller_name && fields.seller_name.trim().length >= 2) score += 5;
  if (fields.seller_phone && fields.seller_phone.trim().length >= 3) score += 5;

  // Description: progressive, up to 10 points.
  //   any text (>=1 char)  → 4 pts
  //   >=30 chars           → 7 pts
  //   >=80 chars           → 10 pts
  // Rewards the user immediately for starting to type instead of being a binary gate.
  const descLen = fields.description?.trim().length ?? 0;
  if (descLen >= 80)       score += 10;
  else if (descLen >= 30)  score += 7;
  else if (descLen >= 1)   score += 4;

  // Optional photo bonus: up to 10 points
  const optionalSlots = PHOTO_SLOTS.filter(s => !s.required);
  const filledOptional = optionalSlots.filter(s => filledSlots.includes(s.slot));
  if (optionalSlots.length > 0) {
    score += Math.round((filledOptional.length / optionalSlots.length) * 10);
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Derive tier — 4 steps aligned with the rev counter color zones
  const tier: QualityTier =
    score >= 80 ? 'prime' :
    score >= 60 ? 'good' :
    score >= 40 ? 'fair' :
    'poor';

  return { score, tier };
}
