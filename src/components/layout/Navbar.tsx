'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Primary navigation
// Structure: logo | links | persistent search | sign in (placeholder) | primary CTA
// Sticky with backdrop blur for modern marketplace feel

const NAV_LINKS = [
  { href: '/listings', label: 'Browse' },
  { href: '/listings', label: 'Auctions', badge: 'SOON' },
  { href: '/sell', label: 'Sell' },
  { href: '#how', label: 'How it works' },
  { href: '#about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo — mono with lime interpunct */}
          <Link href="/" className="flex items-center gap-1 shrink-0 group">
            <span className="font-mono text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--lime-ink)] transition-colors">
              CAR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] group-hover:scale-150 transition-transform" />
            <span className="font-mono text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--lime-ink)] transition-colors">
              LEB
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[var(--lime)] text-[var(--lime-ink)] align-middle">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Persistent search bar — desktop */}
          <form
            action="/listings"
            method="get"
            className="hidden md:flex flex-1 max-w-sm items-center gap-2 px-4 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] focus-within:border-[var(--text)] transition-colors"
          >
            <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              placeholder="Search BMW, Range Rover, Camry..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-faint)]"
            />
          </form>

          {/* Right side — sign in + CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="hidden md:inline-flex text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] px-3 py-2 transition-colors"
            >
              Sign in
            </button>
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full bg-[var(--lime)] text-[var(--lime-ink)] text-sm font-semibold hover:brightness-95 transition-all shadow-[0_0_0_0_rgba(196,248,42,0.5)] hover:shadow-[0_0_0_6px_rgba(196,248,42,0.2)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Sell your car
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[var(--text)]"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--border)] py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-3 text-base font-medium text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[var(--lime)] text-[var(--lime-ink)]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <form action="/listings" method="get" className="flex items-center gap-2 px-4 h-11 rounded-full bg-[var(--surface-2)] border border-[var(--border)] mt-3">
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
