import { calculateCompleteness } from '../completeness';
import { PHOTO_SLOTS } from '../constants';

describe('calculateCompleteness', () => {
  const emptyFields = {
    make: '', model: '', year: null, price_usd: null,
    mileage_km: null, fuel_type: '' as const, transmission: '' as const,
    condition: '' as const, location_city: '', location_region: '',
    description: '',
  };

  const fullFields = {
    make: 'BMW', model: '3 Series', year: 2020, price_usd: 25000,
    mileage_km: 50000, fuel_type: 'petrol' as const, transmission: 'automatic' as const,
    condition: 'used' as const, location_city: 'Beirut', location_region: 'Beirut',
    description: 'Well maintained car with full service history.',
  };

  test('empty listing scores 0', () => {
    const result = calculateCompleteness(emptyFields, []);
    expect(result.score).toBe(0);
    expect(result.tier).toBe('bronze');
  });

  test('all fields filled, no photos scores 40', () => {
    const result = calculateCompleteness(fullFields, []);
    expect(result.score).toBe(40);
    expect(result.tier).toBe('bronze');
  });

  test('all fields + all 8 required photos = gold', () => {
    const requiredSlots = PHOTO_SLOTS
      .filter(s => s.required)
      .map(s => s.slot);
    const result = calculateCompleteness(fullFields, requiredSlots);
    expect(result.score).toBe(90);
    expect(result.tier).toBe('gold');
  });

  test('all fields + 4 required photos = silver', () => {
    const halfSlots = ['front', 'rear', 'left_side', 'right_side'];
    const result = calculateCompleteness(fullFields, halfSlots);
    expect(result.score).toBe(65);
    expect(result.tier).toBe('silver');
  });

  test('optional photo slots add bonus points', () => {
    const requiredSlots = PHOTO_SLOTS.filter(s => s.required).map(s => s.slot);
    const withBonus = [...requiredSlots, 'engine', 'trunk', 'seats'];
    const result = calculateCompleteness(fullFields, withBonus);
    expect(result.score).toBe(100);
    expect(result.tier).toBe('gold');
  });

  test('no description loses 10 points', () => {
    const noDesc = { ...fullFields, description: '' };
    const requiredSlots = PHOTO_SLOTS.filter(s => s.required).map(s => s.slot);
    const result = calculateCompleteness(noDesc, requiredSlots);
    expect(result.score).toBe(80);
    expect(result.tier).toBe('gold');
  });
});
