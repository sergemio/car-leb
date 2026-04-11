import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Hero } from '@/components/home/Hero';
import { WhyCarLeb } from '@/components/home/WhyCarLeb';
import { Listing, ListingPhoto } from '@/types';

export const dynamic = 'force-dynamic';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

// Homepage — Cars & Bids rhythm: Hero with featured car, then listings
// IMMEDIATELY so visitors see inventory above the fold. Stats live inside
// the About section further down. See design-language.md.

export default async function Home() {
  const supabase = createServerSupabase();

  const { data: topListings } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('status', 'active')
    .order('completeness_score', { ascending: false })
    .limit(6);

  const { count: totalCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const listings: ListingWithPhotos[] = (topListings as ListingWithPhotos[]) || [];
  const totalListings = totalCount ?? listings.length;

  // Top 2 go in the hero, rest go in Recent Listings below
  const heroListings = listings.slice(0, 2);
  const recentListings = listings.slice(2);

  return (
    <div>
      <Hero featuredListings={heroListings} totalListings={totalListings} />

      {/* Recent listings — below the hero, skipping the ones already featured */}
      {recentListings.length > 0 && (
        <section className="border-b border-[var(--gray-2)]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20 lg:py-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-3">
                  — Curated
                </div>
                <h2 className="font-display text-[64px] sm:text-[72px] font-black leading-[0.88] text-[var(--ink)]">
                  Recent <span className="font-light text-[var(--gray-3)]">listings</span>
                </h2>
              </div>
              <Link
                href="/listings"
                className="hidden sm:inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--ink)] hover:text-[var(--gray-4)] transition-colors"
              >
                View all →
              </Link>
            </div>
            <ListingGrid listings={recentListings} />
          </div>
        </section>
      )}

      <WhyCarLeb totalListings={totalListings} />
    </div>
  );
}
