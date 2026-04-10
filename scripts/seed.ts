import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SEED_LISTINGS = [
  {
    make: 'BMW', model: '3 Series', year: 2020, price_usd: 32000,
    mileage_km: 45000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Beirut', location_region: 'Beirut',
    description: 'Well maintained BMW 320i. Full service history at dealer. Sport package with M-Sport body kit. Single owner, non-smoker.',
    seller_name: 'Ali M.', seller_phone: '+961 71 000 001', seller_whatsapp: '+961 71 000 001',
    completeness_score: 85, quality_tier: 'gold', status: 'active',
  },
  {
    make: 'Mercedes-Benz', model: 'C-Class', year: 2019, price_usd: 28000,
    mileage_km: 62000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Jounieh', location_region: 'Mount Lebanon',
    description: 'Mercedes C200 in excellent condition. AMG Line package. Panoramic sunroof. Recently serviced.',
    seller_name: 'Georges K.', seller_phone: '+961 03 000 002', seller_whatsapp: '+961 03 000 002',
    completeness_score: 78, quality_tier: 'silver', status: 'active',
  },
  {
    make: 'Toyota', model: 'RAV4', year: 2021, price_usd: 35000,
    mileage_km: 30000, fuel_type: 'hybrid', transmission: 'automatic',
    condition: 'used', location_city: 'Tripoli', location_region: 'North Lebanon',
    description: 'Toyota RAV4 Hybrid XSE. Fuel efficient and reliable. All-wheel drive. Clean title.',
    seller_name: 'Rami S.', seller_phone: '+961 70 000 003', seller_whatsapp: '+961 70 000 003',
    completeness_score: 72, quality_tier: 'silver', status: 'active',
  },
  {
    make: 'Hyundai', model: 'Tucson', year: 2022, price_usd: 27000,
    mileage_km: 20000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Sidon', location_region: 'South Lebanon',
    description: 'Nearly new Tucson with all the bells and whistles. Panoramic roof, heated seats, 360 camera.',
    seller_name: 'Nadia H.', seller_phone: '+961 76 000 004', seller_whatsapp: '+961 76 000 004',
    completeness_score: 65, quality_tier: 'silver', status: 'active',
  },
  {
    make: 'Porsche', model: 'Cayenne', year: 2018, price_usd: 55000,
    mileage_km: 70000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Dbayeh', location_region: 'Mount Lebanon',
    description: 'Porsche Cayenne S. V6 twin-turbo. Air suspension. Sport Chrono package. Well cared for.',
    seller_name: 'Tony B.', seller_phone: '+961 71 000 005', seller_whatsapp: '+961 71 000 005',
    completeness_score: 90, quality_tier: 'gold', status: 'active',
  },
  {
    make: 'Kia', model: 'Sportage', year: 2023, price_usd: 30000,
    mileage_km: 12000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Zahle', location_region: 'Bekaa',
    description: 'Almost new Kia Sportage. GT-Line trim. Dual-tone interior. Under factory warranty.',
    seller_name: 'Maya J.', seller_phone: '+961 03 000 006', seller_whatsapp: '+961 03 000 006',
    completeness_score: 55, quality_tier: 'silver', status: 'active',
  },
];

async function seed() {
  console.log('Seeding Car Leb demo data...');

  await supabase.from('listing_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('listings')
    .insert(SEED_LISTINGS)
    .select('id, make, model');

  if (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} listings:`);
  data.forEach(l => console.log(`  - ${l.make} ${l.model} (${l.id})`));
  console.log('\nSeed complete!');
}

seed();
