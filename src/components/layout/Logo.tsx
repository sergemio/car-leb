import Link from 'next/link';

interface LogoProps {
  /** Color for text and gauge strokes — defaults to --ink */
  tone?: 'dark' | 'light';
  /** Size of the gauge in pixels */
  gaugeWidth?: number;
}

// Car Leb logo — "Car" + rev counter gauge + "Leb"
// The gauge is a half-dial SVG with needle and redline, static (never animated at rest).
// Used in navbar, footer, and anywhere the brand appears.

export function Logo({ tone = 'dark', gaugeWidth = 40 }: LogoProps) {
  const stroke = tone === 'dark' ? '#0A0A0A' : '#FFFFFF';
  const text = tone === 'dark' ? 'text-[var(--ink)]' : 'text-white';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1 font-display text-[28px] font-bold leading-none ${text}`}
    >
      <span className="pt-1.5">Car</span>
      <span
        aria-hidden
        className="inline-block flex-shrink-0"
        style={{ width: gaugeWidth, height: (gaugeWidth * 26) / 40 }}
      >
        <svg viewBox="0 0 40 26" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Half dial arc */}
          <path d="M4 22 A16 16 0 0 1 36 22" fill="none" stroke={stroke} strokeWidth={1} />
          {/* Ticks */}
          <line x1="4" y1="22" x2="6" y2="20" stroke={stroke} strokeWidth={0.8} />
          <line x1="7.2" y1="14.5" x2="9" y2="13.6" stroke={stroke} strokeWidth={0.8} />
          <line x1="12.5" y1="9" x2="13.7" y2="10.6" stroke={stroke} strokeWidth={0.8} />
          <line x1="20" y1="6" x2="20" y2="8" stroke={stroke} strokeWidth={0.8} />
          <line x1="27.5" y1="9" x2="26.3" y2="10.6" stroke={stroke} strokeWidth={0.8} />
          <line x1="32.8" y1="14.5" x2="31" y2="13.6" stroke={stroke} strokeWidth={0.8} />
          {/* Redline — heavier stroke on the right */}
          <line x1="36" y1="22" x2="33.5" y2="20.5" stroke={stroke} strokeWidth={1.8} />
          {/* Needle pointing ~3/4 */}
          <line
            x1="20"
            y1="22"
            x2="30"
            y2="10"
            stroke={stroke}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          {/* Hub */}
          <circle cx="20" cy="22" r="1.3" fill={stroke} />
        </svg>
      </span>
      <span className="pt-1.5">Leb</span>
    </Link>
  );
}
