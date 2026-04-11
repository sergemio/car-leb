import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Photo filenames live in car-leb/public/listings/ and are generated via Imagen.
// A listing with photo=null is kept intentionally to show the line-art placeholder state.
interface SeedListing {
  make: string; model: string; year: number; price_usd: number;
  mileage_km: number; fuel_type: string; transmission: string;
  condition: string; location_city: string; location_region: string;
  description: string;
  seller_name: string; seller_phone: string; seller_whatsapp: string;
  completeness_score: number;
  quality_tier: 'poor' | 'fair' | 'good' | 'prime';
  status: string;
  photo: string | null;
}

const SEED_LISTINGS: SeedListing[] = [
  {
    make: 'BMW', model: '3 Series', year: 2020, price_usd: 32000,
    mileage_km: 45000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Beirut', location_region: 'Beirut',
    description: 'Well maintained BMW 320i. Full service history at dealer. Sport package with M-Sport body kit. Single owner, non-smoker.',
    seller_name: 'Ali M.', seller_phone: '+961 71 000 001', seller_whatsapp: '+961 71 000 001',
    completeness_score: 85, quality_tier: 'prime', status: 'active',
    photo: '/listings/bmw-3-series.png',
  },
  {
    make: 'Mercedes-Benz', model: 'C-Class', year: 2019, price_usd: 28000,
    mileage_km: 62000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Jounieh', location_region: 'Mount Lebanon',
    description: 'Mercedes C200 in excellent condition. AMG Line package. Panoramic sunroof. Recently serviced.',
    seller_name: 'Georges K.', seller_phone: '+961 03 000 002', seller_whatsapp: '+961 03 000 002',
    completeness_score: 78, quality_tier: 'good', status: 'active',
    photo: '/listings/mercedes-c-class.png',
  },
  {
    make: 'Toyota', model: 'RAV4', year: 2021, price_usd: 35000,
    mileage_km: 30000, fuel_type: 'hybrid', transmission: 'automatic',
    condition: 'used', location_city: 'Tripoli', location_region: 'North Lebanon',
    description: 'Toyota RAV4 Hybrid XSE. Fuel efficient and reliable. All-wheel drive. Clean title.',
    seller_name: 'Rami S.', seller_phone: '+961 70 000 003', seller_whatsapp: '+961 70 000 003',
    completeness_score: 72, quality_tier: 'good', status: 'active',
    photo: '/listings/toyota-rav4.png',
  },
  {
    // Intentionally kept photo-less to show the line-art placeholder state on the home grid.
    make: 'Hyundai', model: 'Tucson', year: 2022, price_usd: 27000,
    mileage_km: 20000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Sidon', location_region: 'South Lebanon',
    description: 'Nearly new Tucson with all the bells and whistles. Panoramic roof, heated seats, 360 camera.',
    seller_name: 'Nadia H.', seller_phone: '+961 76 000 004', seller_whatsapp: '+961 76 000 004',
    completeness_score: 45, quality_tier: 'fair', status: 'active',
    photo: null,
  },
  {
    make: 'Porsche', model: 'Cayenne', year: 2018, price_usd: 55000,
    mileage_km: 70000, fuel_type: 'petrol', transmission: 'automatic',
    condition: 'used', location_city: 'Dbayeh', location_region: 'Mount Lebanon',
    description: 'Porsche Cayenne S. V6 twin-turbo. Air suspension. Sport Chrono package. Well cared for.',
    seller_name: 'Tony B.', seller_phone: '+961 71 000 005', seller_whatsapp: '+961 71 000 005',
    completeness_score: 90, quality_tier: 'prime', status: 'active',
    photo: '/listings/porsche-cayenne.png',
  },
  {
    // Budget end of the market — honest old beater, representative of a huge
    // chunk of real Lebanese car transactions.
    make: 'Nissan', model: 'Sunny', year: 2003, price_usd: 3200,
    mileage_km: 245000, fuel_type: 'petrol', transmission: 'manual',
    condition: 'used', location_city: 'Tripoli', location_region: 'North Lebanon',
    description: 'Nissan Sunny 2003, runs well, papers in order. Good first car or daily beater. Minor body scratches, some rust on rear arch. AC works. Selling because I bought something newer.',
    seller_name: 'Hussein A.', seller_phone: '+961 03 000 006', seller_whatsapp: '+961 03 000 006',
    completeness_score: 60, quality_tier: 'good', status: 'active',
    photo: '/listings/nissan-sunny-old.png',
  },
];

async function seed() {
  console.log('Seeding Car Leb demo data...');
  console.log('Safety: this script ONLY deletes listings tagged source="seed".');
  console.log('User-created listings are always preserved.');

  // Only wipe rows created by this script. User uploads (source='user', the default)
  // are never touched — see feedback_car-leb-data-safety.md.
  const { data: seedRows } = await supabase
    .from('listings')
    .select('id')
    .eq('source', 'seed');
  const seedIds = (seedRows ?? []).map(r => r.id);

  if (seedIds.length > 0) {
    await supabase.from('listing_photos').delete().in('listing_id', seedIds);
    await supabase.from('listings').delete().in('id', seedIds);
    console.log(`Removed ${seedIds.length} previous seed listings (user data untouched).`);
  }

  // Strip the 'photo' field before inserting — it isn't a column on listings.
  // Tag every inserted row as source='seed' so future re-runs only touch our own data.
  const listingsForInsert = SEED_LISTINGS.map(({ photo: _photo, ...rest }) => ({
    ...rest,
    source: 'seed',
  }));

  const { data, error } = await supabase
    .from('listings')
    .insert(listingsForInsert)
    .select('id, make, model');

  if (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} listings:`);
  data.forEach(l => console.log(`  - ${l.make} ${l.model} (${l.id})`));

  // Insert front photos for listings that have one.
  // Uses public paths served by Next.js (car-leb/public/listings/*).
  const photoRows = data
    .map((row, i) => {
      const photo = SEED_LISTINGS[i].photo;
      if (!photo) return null;
      return {
        listing_id: row.id,
        slot: 'front',
        url: photo,
      };
    })
    .filter((r): r is { listing_id: string; slot: string; url: string } => r !== null);

  if (photoRows.length > 0) {
    const { error: photoError } = await supabase.from('listing_photos').insert(photoRows);
    if (photoError) {
      console.error('Photo insert failed:', photoError);
      process.exit(1);
    }
    console.log(`Inserted ${photoRows.length} front photos.`);
  }

  console.log('\nSeed complete!');
}

seed();
