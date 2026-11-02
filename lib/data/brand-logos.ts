// Brand logos shown on /commercial, keyed by business id (public.businesses.id).
// Files live in public/brands/. Logos were cut from commercial-index.pdf.
// To add one: drop <business-id>.webp in public/brands/ and add a line here.
export type BrandLogo = { src: string; width: number; height: number };

export const BRAND_LOGOS: Record<string, BrandLogo> = {
  "bazar-sakara": { src: "/brands/bazar-sakara.webp", width: 480, height: 110 },
  "best-home": { src: "/brands/best-home.webp", width: 480, height: 197 },
  bestway: { src: "/brands/bestway.webp", width: 462, height: 379 },
  "better-buns": { src: "/brands/better-buns.webp", width: 480, height: 267 },
  "bike-spot": { src: "/brands/bike-spot.webp", width: 480, height: 406 },
  bready: { src: "/brands/bready.webp", width: 480, height: 270 },
  btech: { src: "/brands/btech.webp", width: 480, height: 124 },
  "bus-stop": { src: "/brands/bus-stop.webp", width: 369, height: 369 },
  carrier: { src: "/brands/carrier.webp", width: 480, height: 222 },
  "crystal-safari": { src: "/brands/crystal-safari.webp", width: 476, height: 381 },
  fabrik: { src: "/brands/fabrik.webp", width: 408, height: 373 },
  "go-bus": { src: "/brands/go-bus.webp", width: 480, height: 197 },
  "hope-and-grill": { src: "/brands/hope-and-grill.webp", width: 470, height: 468 },
  "hope-coffee": { src: "/brands/hope-coffee.webp", width: 480, height: 468 },
  ignite: { src: "/brands/ignite.webp", width: 480, height: 242 },
  kaldi: { src: "/brands/kaldi.webp", width: 430, height: 377 },
  "la-casa": { src: "/brands/la-casa.webp", width: 480, height: 302 },
  layalena: { src: "/brands/layalena.webp", width: 480, height: 230 },
  "makadi-heights-pharmacy": { src: "/brands/makadi-heights-pharmacy.webp", width: 480, height: 426 },
  "makadi-horse-club": { src: "/brands/makadi-horse-club.webp", width: 287, height: 385 },
  movenpick: { src: "/brands/movenpick.webp", width: 480, height: 141 },
  mulliri: { src: "/brands/mulliri.webp", width: 480, height: 162 },
  "neiloo-seafood": { src: "/brands/neiloo-seafood.webp", width: 480, height: 142 },
  "nutri-vibe": { src: "/brands/nutri-vibe.webp", width: 480, height: 305 },
  "on-call-clinic": { src: "/brands/on-call-clinic.webp", width: 462, height: 378 },
  orange: { src: "/brands/orange.webp", width: 368, height: 369 },
  "prima-salon": { src: "/brands/prima-salon.webp", width: 350, height: 369 },
  smokology: { src: "/brands/smokology.webp", width: 480, height: 168 },
  "the-pet-mart": { src: "/brands/the-pet-mart.webp", width: 480, height: 246 },
  "time-out": { src: "/brands/time-out.webp", width: 455, height: 455 },
  vbs: { src: "/brands/vbs.webp", width: 480, height: 161 },
};
