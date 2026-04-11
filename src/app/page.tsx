import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Hero } from '@/components/home/Hero';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { EndingSoon } from '@/components/home/EndingSoon';
import { Stats } from '@/components/home/Stats';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyCarLeb } from '@/components/home/WhyCarLeb';
import { RecentlySold } from '@/components/home/RecentlySold';
import { Newsletter } from '@/components/home/Newsletter';
import { Listing, ListingPhoto } from '@/types';

export const dynamic = 'force-dynamic';

type ListingWithPhotos = Listing & { listing_photos: ListingPhoto[] };

export default async function Home() {
  const supabase = createServerSupabase();

  // Fetch top listings ordered by quality score — best first
  const { data: topListings } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('status', 'active')
    .order('completeness_score', { ascending: false })
    .limit(6);

  // Fetch count for stats
  const { count: totalCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const listings: ListingWithPhotos[] = (topListings as ListingWithPhotos[]) || [];
  const totalListings = totalCount ?? listings.length;

  // Featured listing for hero = the top-ranked gold one with photos
  const featured =
    listings.find(
      (l) => l.quality_tier === 'gold' && l.listing_photos.length > 0
    ) ||
    listings[0] ||
    null;

  // For ending-soon: top 4 that aren't the featured
  const endingSoonListings = listings.filter((l) => l.id !== featured?.id).slice(0, 4);

  // For recently-sold placeholder: reuse seed data
  const recentlySoldListings = listings.slice(2, 5);

  return (
    <div>
      <Hero featured={featured} totalListings={totalListings} />
      <CategoryStrip />
      <EndingSoon listings={endingSoonListings} />

      {/* Top listings grid */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] mb-2">
                CURATED
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text)]">
                Top <em className="italic text-[var(--text-muted)]">listings</em>
              </h2>
              <p className="text-[var(--text-muted)] mt-2 text-sm">
                Hand-picked based on our quality score. Gold tier first.
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-mono font-semibold text-[var(--text)] hover:text-[var(--lime-ink)] transition-colors group"
            >
              Browse all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <ListingGrid listings={listings} />
        </div>
      </section>

      <Stats totalListings={totalListings} />
      <HowItWorks />
      <RecentlySold listings={recentlySoldListings} />
      <WhyCarLeb />
      <Newsletter />
    </div>
  );
}
