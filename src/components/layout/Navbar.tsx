'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

// Primary navigation
// Two states:
// 1. At top — full bar, white bg, hairline border
// 2. Scrolled > 24px — each group becomes a floating white pill with soft shadow,
//    rest of the bar is transparent for vertical visibility
// See design-language.md §7 "Navbar scroll"

const NAV_LINKS = [
  { href: '/listings', label: 'Browse' },
  { href: '/listings', label: 'Auctions' },
  { href: '/sell', label: 'Sell' },
  { href: '#about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = `sticky top-0 z-50 transition-[background,border-color,backdrop-filter] duration-[400ms] ${
    scrolled
      ? 'bg-transparent border-b border-transparent'
      : 'bg-white/92 backdrop-blur-md border-b border-[var(--gray-2)]'
  }`;

  // Shared transition for each nav group (logo / links / ghost / btn)
  const pillBase =
    'transition-[background,border-color,box-shadow,transform,padding,color] duration-[400ms]';
  const pillEasing = { transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' };

  return (
    <nav className={navClass}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-8">
          {/* Logo pill */}
          <div
            style={pillEasing}
            className={`${pillBase} shrink-0 rounded-full px-5 py-2.5 border ${
              scrolled
                ? 'bg-white border-[var(--gray-2)] shadow-[0_10px_28px_-12px_rgba(10,10,10,0.22)] translate-y-0.5'
                : 'bg-transparent border-transparent'
            }`}
          >
            <Logo />
          </div>

          {/* Desktop nav links pill */}
          <div
            style={pillEasing}
            className={`${pillBase} hidden lg:flex items-center gap-8 rounded-full px-6 py-3 border ${
              scrolled
                ? 'bg-white border-[var(--gray-2)] shadow-[0_10px_28px_-12px_rgba(10,10,10,0.22)] translate-y-0.5'
                : 'bg-transparent border-transparent'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-[var(--ink)] font-medium'
                    : 'text-[var(--gray-4)] hover:text-[var(--ink)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: ghost sign-in + primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              style={pillEasing}
              className={`${pillBase} hidden md:inline-flex items-center text-sm text-[var(--gray-4)] hover:text-[var(--ink)] rounded-full px-4 py-2.5 border ${
                scrolled
                  ? 'bg-white border-[var(--gray-2)] shadow-[0_10px_28px_-12px_rgba(10,10,10,0.22)] translate-y-0.5'
                  : 'bg-transparent border-transparent'
              }`}
            >
              Sign in
            </button>

            <Link
              href="/sell"
              style={pillEasing}
              className={`${pillBase} inline-flex items-center gap-2 px-5 h-11 rounded-full border border-[var(--ink)] bg-[var(--ink)] text-white text-sm font-medium hover:opacity-90 ${
                scrolled ? 'shadow-[0_10px_28px_-10px_rgba(10,10,10,0.4)]' : ''
              }`}
            >
              Sell your car
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[var(--ink)]"
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
          <div className="lg:hidden border-t border-[var(--gray-2)] py-4 space-y-1 bg-white">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 text-base font-medium text-[var(--ink)] hover:bg-[var(--gray-1)] rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
