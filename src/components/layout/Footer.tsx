import Link from 'next/link';
import { Logo } from './Logo';

// Minimal footer — 4 columns, hairline separators, no dark band
// Stays consistent with the B&W editorial feel of the rest of the site

interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: LinkGroup[] = [
  {
    title: 'For buyers',
    links: [
      { label: 'Browse', href: '/listings' },
      { label: 'Auctions', href: '/listings' },
      { label: 'Saved', href: '/listings' },
    ],
  },
  {
    title: 'For sellers',
    links: [
      { label: 'Sell your car', href: '/sell' },
      { label: 'Dashboard', href: '/sell' },
      { label: 'Pricing', href: '/sell' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--gray-2)] mt-auto bg-[var(--gray-1)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column — 2 cols wide */}
          <div className="col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-[var(--gray-4)] max-w-xs leading-relaxed">
              A quiet marketplace for quality car listings in Lebanon.
            </p>
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--gray-4)] mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--ink)] hover:text-[var(--gray-4)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--gray-2)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--gray-4)]">
          <span>© 2026 Car Leb · Beirut</span>
          <span>Demo version</span>
        </div>
      </div>
    </footer>
  );
}
