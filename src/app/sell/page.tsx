import { ListingWizard } from '@/components/listing/ListingWizard';

export const dynamic = 'force-dynamic';

export default function SellPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
      <ListingWizard />
    </div>
  );
}
