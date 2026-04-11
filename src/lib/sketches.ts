// Registry of car sketch placeholders available in /public/sketches/
// Used as the hero illustration and as listing card photo fallbacks.
// Kept as a simple array so adding a new sketch = drop PNG in /public/sketches/ + append path here.

export const CAR_SKETCHES: readonly string[] = [
  '/sketches/car-sketch-1.png',
  '/sketches/car-sketch-2.png',
  '/sketches/car-sketch-4.png',
  '/sketches/car-sketch-sedan.png',
  '/sketches/car-sketch-suv.png',
  '/sketches/car-sketch-coupe-classic.png',
] as const;

/** Pick a random sketch path — evaluated fresh at every call (SSR-safe) */
export function getRandomSketch(): string {
  const idx = Math.floor(Math.random() * CAR_SKETCHES.length);
  return CAR_SKETCHES[idx];
}
