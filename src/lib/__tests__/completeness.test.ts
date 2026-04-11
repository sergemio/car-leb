import { calculateCompleteness } from '../completeness';
import { PHOTO_SLOTS } from '../constants';

describe('calculateCompleteness', () => {
  const emptyFields = {
    make: '', model: '', year: null, price_usd: null,
    mileage_km: null, fuel_type: '' as const, transmission: '' as const,
    condition: '' as const, location_city: '', location_region: '',
    description: '', seller_name: '', seller_phone: '',
  };

  const fullFields = {
    make: 'BMW', model: '3 Series', year: 2020, price_usd: 25000,
    mileage_km: 50000, fuel_type: 'petrol' as const, transmission: 'automatic' as const,
    condition: 'used' as const, location_city: 'Beirut', location_region: 'Beirut',
    // 92 chars — lands in the top description bracket (>=80 → 10 pts)
    description: 'Well maintained car with full service history. One owner. Garage kept. No accidents.',
    seller_name: 'Serge', seller_phone: '+9613000000',
  };

  test('empty listing scores 0 and is poor', () => {
    const result = calculateCompleteness(emptyFields, []);
    expect(result.score).toBe(0);
    expect(result.tier).toBe('poor');
  });

  test('all fields + contact, no photos scores 45', () => {
    const result = calculateCompleteness(fullFields, []);
    // 25 essentials + 10 contact + 10 description = 45
    expect(result.score).toBe(45);
    expect(result.tier).toBe('fair');
  });

  test('all fields + all 8 required photos = prime', () => {
    const requiredSlots = PHOTO_SLOTS
      .filter(s => s.required)
      .map(s => s.slot);
    const result = calculateCompleteness(fullFields, requiredSlots);
    // 25 + 45 + 10 + 10 = 90
    expect(result.score).toBe(90);
    expect(result.tier).toBe('prime');
  });

  test('all fields + 4 required photos = good', () => {
    const halfSlots = ['front', 'rear', 'left_side', 'right_side'];
    const result = calculateCompleteness(fullFields, halfSlots);
    // 25 + 23 (4/8 of 45) + 10 + 10 = 68
    expect(result.score).toBe(68);
    expect(result.tier).toBe('good');
  });

  test('optional photo slots add bonus points', () => {
    const requiredSlots = PHOTO_SLOTS.filter(s => s.required).map(s => s.slot);
    const withBonus = [...requiredSlots, 'engine', 'trunk', 'seats'];
    const result = calculateCompleteness(fullFields, withBonus);
    expect(result.score).toBe(100);
    expect(result.tier).toBe('prime');
  });

  test('no description loses 10 points', () => {
    const noDesc = { ...fullFields, description: '' };
    const requiredSlots = PHOTO_SLOTS.filter(s => s.required).map(s => s.slot);
    const result = calculateCompleteness(noDesc, requiredSlots);
    // 25 + 45 + 10 = 80
    expect(result.score).toBe(80);
    expect(result.tier).toBe('prime');
  });
});
