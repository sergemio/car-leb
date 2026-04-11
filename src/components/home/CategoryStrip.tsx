import Link from 'next/link';

// Category strip — horizontal bar of clickable categories right under the hero
// Placeholder: all links go to /listings, filters will come later

interface Category {
  label: string;
  emoji: string;
  slug: string;
}

const CATEGORIES: Category[] = [
  { label: 'SUV', emoji: '🚙', slug: 'suv' },
  { label: 'Sedan', emoji: '🚗', slug: 'sedan' },
  { label: 'Sports', emoji: '🏎️', slug: 'sports' },
  { label: 'Classics', emoji: '🚘', slug: 'classic' },
  { label: 'Electric', emoji: '⚡', slug: 'electric' },
  { label: '4×4', emoji: '🛻', slug: '4x4' },
  { label: 'Luxury', emoji: '✨', slug: 'luxury' },
  { label: 'Convertible', emoji: '🌤️', slug: 'convertible' },
];

export function CategoryStrip() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-2)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] shrink-0 pr-2 border-r border-[var(--border)]">
            Browse by
          </span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href="/listings"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text)] hover:bg-[var(--lime-soft)] transition-all text-sm font-medium text-[var(--text)]"
            >
              <span className="text-base">{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
