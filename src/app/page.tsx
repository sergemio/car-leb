import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Listing, ListingPhoto } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerSupabase();

  const { data: listings } = await supabase
    .from('listings')
    .select('*, listing_photos(*)')
    .eq('status', 'active')
    .order('completeness_score', { ascending: false })
    .limit(6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Find your next car in Lebanon
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Quality listings. Real photos. Fair prices. The car marketplace Lebanon deserves.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/listings"
                className="px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold text-center hover:bg-blue-50 transition-colors"
              >
                Browse Cars
              </Link>
              <Link
                href="/sell"
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-center hover:bg-blue-400 transition-colors border border-blue-400"
              >
                Sell Your Car
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Listings</h2>
          <Link href="/listings" className="text-blue-600 hover:underline text-sm font-medium">
            View all
          </Link>
        </div>
        <ListingGrid listings={(listings as (Listing & { listing_photos: ListingPhoto[] })[]) || []} />
      </section>

      {/* Value props */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Structured Photos</h3>
              <p className="text-sm text-gray-500">Every listing shows the car from all angles. No more guessing.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Quality First</h3>
              <p className="text-sm text-gray-500">Better listings rank higher. No more $1 prices or empty ads.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fair Prices</h3>
              <p className="text-sm text-gray-500">Our system flags suspicious prices so you know what's real.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
