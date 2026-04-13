import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Hero } from '@/components/home/Hero';
import { FeaturedShowcase } from '@/components/home/FeaturedShowcase';
import { WhyCarLeb } from '@/components/home/WhyCarLeb';
import { Listing, ListingPhoto } from '@/types';

export const dynamic = 'force-dynamic';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

// Homepage layout (per Serge's Photoshop mockup):
// 1. Hero — compact branding (title left, subtitle+sketch+CTAs right)
// 2. FeaturedShowcase — Cars & Bids mosaic, auto-rotates
// 3. Recent Listings — card grid
// 4. WhyCarLeb — about section

export default async function Home() {
  const supabase = createServerSupabase();

  const [{ data: topListings }, { count: totalCount }] = await Promise.all([
    supabase
      .from('listings')
      .select('*, listing_photos(*)')
      .eq('status', 'active')
      .order('completeness_score', { ascending: false })
      .limit(6),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
  ]);

  const listings: ListingWithPhotos[] = (topListings as ListingWithPhotos[]) || [];
  const totalListings = totalCount ?? listings.length;

  return (
    <div>
      <Hero totalListings={totalListings} />

      {/* Featured showcase — Cars & Bids mosaic */}
      {listings.length > 0 && (
        <FeaturedShowcase listings={listings} />
      )}

      {/* Recent listings grid */}
      {listings.length > 0 && (
        <section className="border-b border-[var(--gray-2)]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-[48px] sm:text-[56px] font-black leading-[0.88] text-[var(--ink)]">
                Recent <span className="font-light text-[var(--gray-3)]">listings</span>
              </h2>
              <Link
                href="/listings"
                className="hidden sm:inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--ink)] hover:text-[var(--gray-4)] transition-colors"
              >
                View all →
              </Link>
            </div>
            <ListingGrid listings={listings} />
          </div>
        </section>
      )}

      <WhyCarLeb totalListings={totalListings} />
    </div>
  );
}
