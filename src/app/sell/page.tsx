import { ListingWizard } from '@/components/listing/ListingWizard';

export const dynamic = 'force-dynamic';

export default function SellPage() {
  // Wizard renders its own sticky quality bar at full width,
  // so no outer container here.
  return <ListingWizard />;
}
