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
  isFeatured: boolean;
  featuredOrder?: number;
}

// MOCK: no GET /api/public/brand
export const BRAND = {
  name: "Dino studio",
  story:
    "We are an artisan silver jewelry brand for creative international buyers seeking soulful handcrafted objects inspired by and shaped by tide, time, and nature's imperfect hand.",
  positioning: "Artisan Luxury · Ocean Relic · Organic Sculpture",
  keywords: "Refined Simplicity, Timeless Elegance",
  signature:
    "Meticulously finished with a sophisticated sandblasted texture, the sterling silver reveals a soft, radiant shimmer that accentuates the purity and brilliance of the precious metal. Designed to embody quiet luxury, each piece offers an elegant statement of timeless refinement.",
  /** MOCK: cover copy for homepage — European / Australian collector angle */
  coverNarrative:
    "For creative buyers across Europe and Australia — silent stories in sterling silver, made to be lived with and collected.",
  /** MOCK: sandblast texture macro until product photography */
  signatureImage:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
} as const;

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
    editorialImage: "/collections/botanical-whispers-editorial.png",
    editorialImage2:
      "https://images.unsplash.com/photo-1588186325868-bd2f86b05f73?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 1,
  },
  {
    slug: "fallen-petals",
    name: "Fallen Petals",
    tagline: "Preserving fleeting beauty in precious metal",
    mood: "Romantic · Fragile · Poetic",
    heroImage:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 2,
  },
  {
    slug: "wild-bloom",
    name: "Wild Bloom",
    tagline: "Beauty in its untamed form",
    mood: "Organic · Raw · Expressive",
    heroImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 3,
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
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: false,
  },
];

export function getFeaturedCollections() {
  return COLLECTIONS.filter((c) => c.isFeatured).sort(
    (a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
  );
}

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
