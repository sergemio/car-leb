'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

// Spotlight glow CSS variables for the nav links pill
const GLOW_VARS: React.CSSProperties & Record<string, string | number> = {
  '--base': 142,
  '--spread': 0,
  '--radius': 9999,
  '--border': 2,
  '--backdrop': 'hsl(0 0% 100%)',
  '--backup-border': 'hsl(0 0% 90%)',
  '--size': 200,
  '--outer': 1,
  '--saturation': 76,
  '--lightness': 50,
  '--bg-spot-opacity': 0.08,
  '--border-spot-opacity': 1,
  '--border-light-opacity': 0.5,
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  // /sell has a sticky quality rev-counter right under the navbar,
  // so the scroll-to-pills (transparent bg) trick breaks visual coherence.
  // Force the solid navbar on that page.
  const solidOnly = pathname === '/sell';

  useEffect(() => {
    if (solidOnly) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solidOnly]);

  // Spotlight glow pointer tracking
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const el = glowRef.current;
      if (!el) return;
      el.style.setProperty('--x', e.clientX.toFixed(2));
      el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      el.style.setProperty('--y', e.clientY.toFixed(2));
      el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      // Also set on the inner glow child
      const inner = el.querySelector<HTMLElement>('[data-glow]');
      if (inner) {
        inner.style.setProperty('--x', e.clientX.toFixed(2));
        inner.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        inner.style.setProperty('--y', e.clientY.toFixed(2));
        inner.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener('pointermove', onPointerMove);
    return () => document.removeEventListener('pointermove', onPointerMove);
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

          {/* Desktop nav links pill — with spotlight glow */}
          <div
            ref={glowRef}
            data-glow
            style={{ ...pillEasing, ...GLOW_VARS, borderRadius: '9999px' } as React.CSSProperties}
            className={`${pillBase} hidden lg:flex items-center gap-8 rounded-full px-6 py-3 ${
              scrolled
                ? 'shadow-[0_10px_28px_-12px_rgba(10,10,10,0.22)] translate-y-0.5'
                : ''
            }`}
          >
            <div data-glow />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative z-[1] text-sm transition-colors duration-200 ${
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

            {/* Mobile menu toggle — pill style matching other nav elements */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={pillEasing}
              className={`${pillBase} lg:hidden flex items-center justify-center w-11 h-11 rounded-full border bg-white border-[var(--gray-2)] shadow-[0_4px_12px_-4px_rgba(10,10,10,0.12)]`}
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
      </div>

      {/* Mobile menu — fullscreen overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] z-40 transition-opacity duration-300 ease-out ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        {/* Menu panel — slides down */}
        <div
          className={`relative bg-white shadow-[0_20px_40px_-12px_rgba(10,10,10,0.15)] transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-4 text-lg font-medium text-[var(--ink)] hover:bg-[var(--gray-1)] rounded-xl transition-colors"
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  transition: `opacity 300ms ease-out ${i * 50}ms, transform 300ms ease-out ${i * 50}ms, background-color 200ms`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-6 pb-6 pt-2 border-t border-[var(--gray-2)]">
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 text-sm text-[var(--gray-4)] hover:text-[var(--ink)] transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
