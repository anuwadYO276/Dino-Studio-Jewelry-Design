/**
 * MOCK DATA — brand & collections (no product API yet for these)
 *
 * Replace with API when backend is ready:
 *   GET /api/public/brand
 *   GET /api/public/collections
 *   GET /api/public/collections/:slug
 *
 * Products use GET /api/products (wired in product-grid, product-detail).
 */

export interface ShowcaseCollection {
  slug: string;
  name: string;
  tagline: string;
  mood: string;
  /** API: heroImageUrl from CMS or collection record */
  heroImage: string;
  /** API: editorialImageUrl */
  editorialImage: string;
  /** MOCK: second editorial asset for collage layouts */
  editorialImage2?: string;
}

// MOCK: no GET /api/public/brand
export const BRAND = {
  name: "Dino studio",
  story:
    "We are an artisan silver jewelry brand for creative international buyers seeking soulful handcrafted objects inspired by and shaped by tide, time, and nature's imperfect hand.",
  keywords: "Refined Simplicity, Timeless Elegance",
  signature:
    "Meticulously finished with a sophisticated sandblasted texture, the sterling silver reveals a soft, radiant shimmer that accentuates the purity and brilliance of the precious metal. Designed to embody quiet luxury, each piece offers an elegant statement of timeless refinement.",
  /** Home — one line; full story stays in `story` for SEO / about */
  homeHeroLine: "Silent stories in sterling silver",
  /** MOCK: brand story editorial until atelier photography */
  storyImage:
    "https://lnjewelryfactory.com/wp-content/uploads/2018/04/adult-artisan-black-and-white-848205.jpg",
} as const;

/** Brief: catalogue cover order — home editorial trilogy (first slug = hero cover) */
export const HOME_COVER_SLUGS = [
  "botanical-whispers",
  "fallen-petals",
  "wild-bloom",
] as const;

export const CATEGORY_LINKS = [
  { value: "ring", label: "Ring" },
  { value: "earring", label: "Earring" },
  { value: "pendant", label: "Pendant" },
  { value: "necklace", label: "Necklace" },
  { value: "bracelet", label: "Bracelet" },
  { value: "set", label: "Set" },
] as const;

// MOCK: editorial placeholders — unique per collection, mood props not product shots
export const COLLECTIONS: ShowcaseCollection[] = [
  {
    slug: "botanical-whispers",
    name: "Botanical Whispers",
    tagline: "Silent stories carried by petals and wind",
    mood: "Quiet luxury · Silver florals · European garden",
    heroImage: "/collections/botanical-whispers-hero.png",
    editorialImage: "https://www.lubyma.com/cdn/shop/files/IMG_0217.jpg?v=1752810073&width=1946",
    editorialImage2:
      "https://www.lubyma.com/cdn/shop/files/IMG_0217.jpg?v=1752810073&width=1946",
  },
  {
    slug: "fallen-petals",
    name: "Fallen Petals",
    tagline: "Preserving fleeting beauty in precious metal",
    mood: "Romantic · Fragile · Poetic",
    heroImage:
      "https://chairish-prod.freetls.fastly.net/image/product/master/819e0465-34c8-497f-ae0e-fb72075aa5f9/vintage-miao-tribal-silver-dragon-earrings-asian-tribal-jewelry-a-pair-3029",
    editorialImage:
      "https://chairish-prod.freetls.fastly.net/image/product/master/819e0465-34c8-497f-ae0e-fb72075aa5f9/vintage-miao-tribal-silver-dragon-earrings-asian-tribal-jewelry-a-pair-3029",
  },
  {
    slug: "wild-bloom",
    name: "Wild Bloom",
    tagline: "Beauty in its untamed form",
    mood: "Organic · Raw · Expressive",
    heroImage:
      "https://quirksmith.com/cdn/shop/files/floral-drop-earrings-quirksmith-897106.jpg?v=1723637886&width=2048",
    editorialImage:
      "https://quirksmith.com/cdn/shop/files/floral-drop-earrings-quirksmith-897106.jpg?v=1723637886&width=2048",
  },
  {
    slug: "primitive-gold",
    name: "Primitive Gold",
    tagline: "Sculpted by nature. Refined by hand",
    mood: "Luxury · Tribal · Artistic",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
  },
  {
    slug: "sacred-fragments",
    name: "Sacred Fragments",
    tagline: "Fragments of ancient beauty, reimagined as wearable art",
    mood: "Archaeological · Sacred · Sculptural",
    heroImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    editorialImage2:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
  },
  {
    slug: "golden-relics",
    name: "Golden Relics",
    tagline: "Echoes of time cast in silver and gold",
    mood: "Temporal · Relic · Heritage",
    heroImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80",
    editorialImage2:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "organic-architecture",
    name: "Organic Architecture",
    tagline: "Where nature becomes structure",
    mood: "Structural · Geometric · Natural",
    heroImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80",
  },
  {
    slug: "woven-by-nature",
    name: "Woven by Nature",
    tagline: "Intricate forms inspired by the silent geometry of nature",
    mood: "Intricate · Textural · Meditative",
    heroImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200&q=80",
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
