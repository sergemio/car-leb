// Registry of car sketch placeholders available in /public/sketches/
// Used as the hero illustration and as listing card photo fallbacks.
// Kept as a simple array so adding a new sketch = drop PNG in /public/sketches/ + append path here.

export const CAR_SKETCHES: readonly string[] = [
  '/sketches/car-sketch-1.webp',
  '/sketches/car-sketch-2.webp',
  '/sketches/car-sketch-4.webp',
  '/sketches/car-sketch-sedan.webp',
  '/sketches/car-sketch-suv.webp',
  '/sketches/car-sketch-coupe-classic.webp',
] as const;

/** Pick a random sketch path — evaluated fresh at every call (SSR-safe) */
export function getRandomSketch(): string {
  const idx = Math.floor(Math.random() * CAR_SKETCHES.length);
  return CAR_SKETCHES[idx];
}
