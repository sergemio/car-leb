import type { Metadata } from 'next';
import { Big_Shoulders, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

// Display font — condensed industrial sans, motorsport/Chicago-steel vibe
const bigShoulders = Big_Shoulders({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

// Body font — IBM Plex Sans, editorial feel, technical but readable
const plex = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

// Mono font — numbers, references, captions, stats
const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Car Leb — The Lebanese Car Marketplace',
  description:
    'A quiet marketplace for quality car listings in Lebanon. Structured photos, fair prices, no chaos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${plex.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--white)] text-[var(--ink)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
