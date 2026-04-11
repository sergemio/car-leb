import Link from 'next/link';

// Rich multi-column footer with brand, link columns, socials, legal

interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'For buyers',
    links: [
      { label: 'Browse listings', href: '/listings' },
      { label: 'Saved searches', href: '/listings' },
      { label: 'How to buy', href: '#how' },
      { label: 'Auctions', href: '/listings' },
    ],
  },
  {
    title: 'For sellers',
    links: [
      { label: 'Sell your car', href: '/sell' },
      { label: 'Seller dashboard', href: '/sell' },
      { label: 'Pricing guide', href: '#about' },
      { label: 'Valuation', href: '#about' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'How it works', href: '#how' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--text)] text-white mt-auto relative overflow-hidden">
      {/* Lime accent strip */}
      <div className="h-1 bg-[var(--lime)]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-1 group">
              <span className="font-mono text-xl font-bold tracking-tight text-white">CAR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] group-hover:scale-150 transition-transform" />
              <span className="font-mono text-xl font-bold tracking-tight text-white">LEB</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              The Lebanese car marketplace. Quality listings, verified photos, fair prices.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              BEIRUT, LEBANON
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2 pt-2">
              {['IG', 'X', 'FB', 'TT'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold text-white/70 hover:bg-[var(--lime)] hover:text-[var(--lime-ink)] hover:border-[var(--lime)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 hover:text-[var(--lime)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big logo type — decorative edge */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="font-display text-[18vw] leading-[0.85] font-medium text-white/[0.04] tracking-tighter select-none pointer-events-none overflow-hidden">
            CAR·LEB
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-mono">
          <div>© 2026 Car Leb. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] live-dot" />
            DEMO VERSION — NOT YET OPEN TO THE PUBLIC
          </div>
        </div>
      </div>
    </footer>
  );
}
