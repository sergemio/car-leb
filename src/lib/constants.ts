// Static data for dropdowns, filters, and photo slots
// Why here: single source of truth, easy to update

import { PhotoSlotName } from '@/types';

// Lebanese regions and major cities
export const REGIONS = [
  { region: 'Beirut', cities: ['Beirut', 'Achrafieh', 'Hamra', 'Verdun', 'Mar Mikhael'] },
  { region: 'Mount Lebanon', cities: ['Jounieh', 'Byblos', 'Broummana', 'Aley', 'Baabda', 'Dbayeh'] },
  { region: 'North Lebanon', cities: ['Tripoli', 'Batroun', 'Bcharre', 'Zgharta'] },
  { region: 'South Lebanon', cities: ['Sidon', 'Tyre', 'Nabatieh', 'Jezzine'] },
  { region: 'Bekaa', cities: ['Zahle', 'Baalbek', 'Chtaura'] },
] as const;

// Car makes and their models (top brands in Lebanon)
export const CAR_MAKES: Record<string, string[]> = {
  'BMW': ['3 Series', '5 Series', 'X1', 'X3', 'X5', 'X6', '7 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'A-Class'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'TT'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Yaris', 'Fortuner', 'Hilux'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'City'],
  'Hyundai': ['Tucson', 'Elantra', 'Santa Fe', 'Accent', 'Creta', 'Kona'],
  'Kia': ['Sportage', 'Cerato', 'Sorento', 'Seltos', 'Picanto', 'K5'],
  'Nissan': ['Sentra', 'Altima', 'X-Trail', 'Patrol', 'Kicks', 'Qashqai'],
  'Volkswagen': ['Golf', 'Tiguan', 'Passat', 'Polo', 'T-Roc', 'ID.4'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Defender', 'Discovery', 'Evoque'],
  'Porsche': ['Cayenne', 'Macan', '911', 'Panamera', 'Taycan'],
  'Lexus': ['RX', 'NX', 'ES', 'IS', 'LX', 'UX'],
  'Mazda': ['CX-5', 'CX-3', 'Mazda3', 'Mazda6', 'CX-30'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade'],
  'Ford': ['Mustang', 'Explorer', 'Edge', 'Bronco', 'F-150'],
  'Chevrolet': ['Camaro', 'Tahoe', 'Traverse', 'Trax', 'Silverado'],
  'Mitsubishi': ['Outlander', 'L200', 'Pajero', 'Eclipse Cross', 'ASX'],
  'Suzuki': ['Vitara', 'Swift', 'Jimny', 'S-Cross'],
  'Peugeot': ['208', '308', '3008', '5008', '2008'],
  'Renault': ['Clio', 'Megane', 'Kadjar', 'Duster', 'Captur'],
  'Other': ['Other'],
};

export const MAKE_NAMES = Object.keys(CAR_MAKES).sort();

// Photo slots definition
export const PHOTO_SLOTS: { slot: PhotoSlotName; label: string; required: boolean }[] = [
  { slot: 'front', label: 'Front', required: true },
  { slot: 'rear', label: 'Rear', required: true },
  { slot: 'left_side', label: 'Left Side', required: true },
  { slot: 'right_side', label: 'Right Side', required: true },
  { slot: 'front_quarter', label: 'Front 3/4', required: true },
  { slot: 'rear_quarter', label: 'Rear 3/4', required: true },
  { slot: 'dashboard', label: 'Dashboard', required: true },
  { slot: 'wheels', label: 'Wheels', required: true },
  { slot: 'engine', label: 'Engine Bay', required: false },
  { slot: 'trunk', label: 'Trunk', required: false },
  { slot: 'seats', label: 'Seats', required: false },
];

export const MIN_YEAR = 1990;
export const MAX_YEAR = new Date().getFullYear() + 1;
export const YEARS = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MAX_YEAR - i
);

// Fuel types available in Lebanon (no diesel — see spec)
export const FUEL_TYPES_LEBANON = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
] as const;
