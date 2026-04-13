import Link from 'next/link';
import { getRandomSketch } from '@/lib/sketches';

interface HeroProps {
  totalListings: number;
}

// Hero — compact split layout per Serge's Photoshop mockup:
// Left: giant title only
// Right: subtitle text + sketch + CTA buttons
// No featured cards here — FeaturedShowcase handles that below.

export function Hero({ totalListings }: HeroProps) {
  const sketch = getRandomSketch();

  return (
    <section className="border-b border-[var(--gray-2)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-10 lg:pt-12 pb-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-end">
          {/* Left — title only */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gray-4)] mb-4 flex items-center gap-3 reveal reveal-1">
              <span className="w-7 h-px bg-[var(--ink)]" />
              LEBANON · EST. 2026
            </div>

            <h1 className="font-display text-[72px] sm:text-[100px] lg:text-[100px] xl:text-[112px] font-black leading-[0.85] text-[var(--ink)] reveal reveal-2">
              The cars
              <br />
              of <span className="font-light text-[var(--gray-3)]">Lebanon</span>,
              <br />
              indexed.
            </h1>
          </div>

          {/* Right — sketch + subtitle + CTAs */}
          <div className="mt-8 lg:mt-0 reveal reveal-3">
            {/* Sketch */}
            <div className="hidden lg:block max-w-[380px] pointer-events-none mb-4">
              <img
                src={sketch}
                alt=""
                aria-hidden
                className="w-full h-auto select-none"
              />
            </div>

            {/* Subtitle */}
            <p className="text-[16px] leading-[1.55] text-[var(--gray-4)] max-w-[420px]">
              A quiet marketplace for quality listings. Structured photos, fair prices, no chaos.
              Built for buyers who want to see the full picture.
            </p>

            {/* CTAs — liquid glass buttons */}
            <div className="flex flex-wrap gap-3 mt-6 reveal reveal-4">
              <Link href="/listings" className="btn-liquid px-7 h-11 rounded-full text-sm font-medium text-[var(--ink)]">
                <div className="btn-liquid__glass" />
                <div className="btn-liquid__blur" />
                <span className="relative z-10 pointer-events-none">Browse cars →</span>
              </Link>
              <Link href="/sell" className="btn-liquid px-7 h-11 rounded-full text-sm font-medium text-[var(--ink)]">
                <div className="btn-liquid__glass" />
                <div className="btn-liquid__blur" />
                <span className="relative z-10 pointer-events-none">Sell your car</span>
              </Link>
            </div>

            {/* SVG filter for liquid glass effect */}
            <svg className="hidden">
              <defs>
                <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
                  <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                  <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                  <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
