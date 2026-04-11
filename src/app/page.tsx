import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { WhyCarLeb } from '@/components/home/WhyCarLeb';
import { Listing, ListingPhoto } from '@/types';

export const dynamic = 'force-dynamic';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

// Homepage — minimal editorial layout
// Sections: Hero → Stats → Recent listings → Why Car Leb
// Following design-language.md — B&W editorial, no dense blocks,
// every section breathes, photos dominate

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

  const featured = listings[0] || null;

  return (
    <div>
      <Hero featured={featured} totalListings={totalListings} />
      <Stats totalListings={totalListings} />

      {/* Recent listings grid */}
      <section className="border-b border-[var(--gray-2)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gray-4)] mb-3">
                — Curated
              </div>
              <h2 className="font-display text-[72px] font-black leading-[0.88] text-[var(--ink)]">
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
          <ListingGrid listings={listings} />
        </div>
      </section>

      <WhyCarLeb />
    </div>
  );
}
