/**
 * MOCK DATA — wholesale customer catalogue
 *
 * Replace with API calls when backend is ready:
 *   GET /api/public/collections
 *   GET /api/public/collections/:slug
 *   GET /api/public/products?collection=&category=&material=
 *   GET /api/public/products/:id
 *   GET /api/public/brand
 */

export type ProductCategory =
  | "ring"
  | "earring"
  | "pendant"
  | "necklace"
  | "bracelet"
  | "bangle"
  | "other";

export type ProductMaterial =
  | "silver"
  | "gold-plated"
  | "rose-gold-plated"
  | "black-rhodium";

export interface ShowcaseCollection {
  slug: string;
  name: string;
  tagline: string;
  mood: string;
  /** API: heroImageUrl from CMS or collection record */
  heroImage: string;
  /** API: editorialImageUrl */
  editorialImage: string;
  isFeatured: boolean;
  featuredOrder?: number;
}

export interface ShowcaseProduct {
  id: string;
  /** API: sku / productCode */
  code: string;
  name: string;
  slug: string;
  collectionSlug: string;
  category: ProductCategory;
  material: ProductMaterial;
  /** API: variants[].size joined or primary variant size */
  size: string;
  /** API: weightGrams formatted */
  weight: string;
  /** API: wholesalePrice — currency from buyer profile */
  price: number;
  /** API: packagingDescription */
  packaging: string;
  description: string;
  images: {
    /** API: images where type = product */
    product: string;
    /** API: images where type = lifestyle */
    lifestyle?: string;
    /** API: images where type = editorial */
    editorial?: string;
    /** API: images where type = wearing */
    wearing?: string;
  };
}

// API: GET /api/public/brand
export const BRAND = {
  name: "Dino studio",
  story:
    "We are an artisan silver jewelry brand for creative international buyers seeking soulful handcrafted objects inspired by and shaped by tide, time, and nature's imperfect hand.",
  positioning: "Artisan Luxury · Ocean Relic · Organic Sculpture",
  keywords: "Refined Simplicity, Timeless Elegance",
  signature:
    "Meticulously finished with a sophisticated sandblasted texture, the sterling silver reveals a soft, radiant shimmer that accentuates the purity and brilliance of the precious metal. Designed to embody quiet luxury, each piece offers an elegant statement of timeless refinement.",
} as const;

// API: GET /api/public/collections
export const COLLECTIONS: ShowcaseCollection[] = [
  {
    slug: "botanical-whispers",
    name: "Botanical Whispers",
    tagline: "Silent stories carried by petals and wind",
    mood: "Luxury · Editorial · European collector",
    heroImage:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 1,
  },
  {
    slug: "fallen-petals",
    name: "Fallen Petals",
    tagline: "Preserving fleeting beauty in precious metal",
    mood: "Romantic · Fragile · Poetic",
    heroImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 2,
  },
  {
    slug: "wild-bloom",
    name: "Wild Bloom",
    tagline: "Beauty in its untamed form",
    mood: "Organic · Raw · Expressive",
    heroImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1617032219428-8f04d8bd251a?w=1200&q=80",
    isFeatured: true,
    featuredOrder: 3,
  },
  {
    slug: "primitive-gold",
    name: "Primitive Gold",
    tagline: "Sculpted by nature. Refined by hand",
    mood: "Luxury · Tribal · Artistic",
    heroImage:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80",
    isFeatured: false,
  },
  {
    slug: "sacred-fragments",
    name: "Sacred Fragments",
    tagline: "Fragments of ancient beauty, reimagined as wearable art",
    mood: "Archaeological · Sacred · Sculptural",
    heroImage:
      "https://images.unsplash.com/photo-1603561596112-0a1327570e9b?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=1200&q=80",
    isFeatured: false,
  },
  {
    slug: "golden-relics",
    name: "Golden Relics",
    tagline: "Echoes of time cast in silver and gold",
    mood: "Temporal · Relic · Heritage",
    heroImage:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
    isFeatured: false,
  },
  {
    slug: "organic-architecture",
    name: "Organic Architecture",
    tagline: "Where nature becomes structure",
    mood: "Structural · Geometric · Natural",
    heroImage:
      "https://images.unsplash.com/photo-1603561596112-0a1327570e9b?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80",
    isFeatured: false,
  },
  {
    slug: "woven-by-nature",
    name: "Woven by Nature",
    tagline: "Intricate forms inspired by the silent geometry of nature",
    mood: "Intricate · Textural · Meditative",
    heroImage:
      "https://images.unsplash.com/photo-1617032219428-8f04d8bd251a?w=1600&q=80",
    editorialImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80",
    isFeatured: false,
  },
];

// API: GET /api/public/products
export const PRODUCTS: ShowcaseProduct[] = [
  {
    id: "bw-001",
    code: "BW-RG-001",
    name: "Petal Curve Ring",
    slug: "petal-curve-ring",
    collectionSlug: "botanical-whispers",
    category: "ring",
    material: "silver",
    size: "US 6–8",
    weight: "4.2 g",
    price: 89,
    packaging: "Recycled cotton pouch + branded card",
    description:
      "An asymmetric band echoing a wind-lifted petal, finished in soft sandblast silver.",
    images: {
      product:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      lifestyle:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      editorial:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
      wearing:
        "https://images.unsplash.com/photo-1603561596112-0a1327570e9b?w=800&q=80",
    },
  },
  {
    id: "bw-002",
    code: "BW-ER-002",
    name: "Whisper Drop Earrings",
    slug: "whisper-drop-earrings",
    collectionSlug: "botanical-whispers",
    category: "earring",
    material: "gold-plated",
    size: "38 mm drop",
    weight: "6.8 g",
    price: 124,
    packaging: "Recycled cotton pouch + branded card",
    description:
      "Long linear drops with a brushed matte surface — movement like petals in breeze.",
    images: {
      product:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      lifestyle:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      wearing:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    },
  },
  {
    id: "fp-001",
    code: "FP-PD-001",
    name: "Fallen Bloom Pendant",
    slug: "fallen-bloom-pendant",
    collectionSlug: "fallen-petals",
    category: "pendant",
    material: "rose-gold-plated",
    size: "Chain 45 cm",
    weight: "8.1 g",
    price: 156,
    packaging: "Velvet-lined box + care card",
    description:
      "A suspended petal form preserving fleeting botanical beauty in rose gold plate.",
    images: {
      product:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      editorial:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      wearing:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    },
  },
  {
    id: "fp-002",
    code: "FP-NK-002",
    name: "Petal Chain Necklace",
    slug: "petal-chain-necklace",
    collectionSlug: "fallen-petals",
    category: "necklace",
    material: "silver",
    size: "42 cm",
    weight: "12.4 g",
    price: 198,
    packaging: "Velvet-lined box + care card",
    description:
      "Interlocking petal links with sandblasted finish — quiet luxury for everyday wear.",
    images: {
      product:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      lifestyle:
        "https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=800&q=80",
    },
  },
  {
    id: "wb-001",
    code: "WB-RG-001",
    name: "Wild Thorn Ring",
    slug: "wild-thorn-ring",
    collectionSlug: "wild-bloom",
    category: "ring",
    material: "black-rhodium",
    size: "US 5–7",
    weight: "5.6 g",
    price: 112,
    packaging: "Recycled cotton pouch + branded card",
    description:
      "Untamed thorn silhouette in black rhodium — beauty in its raw, unrefined form.",
    images: {
      product:
        "https://images.unsplash.com/photo-1603561596112-0a1327570e9b?w=800&q=80",
      editorial:
        "https://images.unsplash.com/photo-1617032219428-8f04d8bd251a?w=800&q=80",
    },
  },
  {
    id: "wb-002",
    code: "WB-BR-002",
    name: "Bloom Cuff Bracelet",
    slug: "bloom-cuff-bracelet",
    collectionSlug: "wild-bloom",
    category: "bracelet",
    material: "silver",
    size: "Adjustable 16–18 cm",
    weight: "18.2 g",
    price: 245,
    packaging: "Velvet-lined box + care card",
    description:
      "Open cuff with organic bloom relief — a sculptural statement for the wrist.",
    images: {
      product:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      wearing:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    },
  },
  {
    id: "pg-001",
    code: "PG-RG-001",
    name: "Primitive Band",
    slug: "primitive-band",
    collectionSlug: "primitive-gold",
    category: "ring",
    material: "gold-plated",
    size: "US 6–9",
    weight: "7.3 g",
    price: 134,
    packaging: "Recycled cotton pouch + branded card",
    description:
      "Tribal-inspired band with hand-hammered texture — nature sculpted, hand refined.",
    images: {
      product:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      lifestyle:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    },
  },
  {
    id: "pg-002",
    code: "PG-ER-002",
    name: "Tribal Arc Earrings",
    slug: "tribal-arc-earrings",
    collectionSlug: "primitive-gold",
    category: "earring",
    material: "gold-plated",
    size: "32 mm",
    weight: "9.1 g",
    price: 148,
    packaging: "Recycled cotton pouch + branded card",
    description: "Bold arc forms referencing ancient adornment rituals.",
    images: {
      product:
        "https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=800&q=80",
    },
  },
  {
    id: "sf-001",
    code: "SF-PD-001",
    name: "Fragment Relic Pendant",
    slug: "fragment-relic-pendant",
    collectionSlug: "sacred-fragments",
    category: "pendant",
    material: "silver",
    size: "Chain 50 cm",
    weight: "11.7 g",
    price: 176,
    packaging: "Velvet-lined box + care card",
    description:
      "Broken-circle relic form — ancient beauty reimagined as wearable sculpture.",
    images: {
      product:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      editorial:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    },
  },
  {
    id: "gr-001",
    code: "GR-BG-001",
    name: "Relic Bangle",
    slug: "relic-bangle",
    collectionSlug: "golden-relics",
    category: "bangle",
    material: "gold-plated",
    size: "Inner 6.2 cm",
    weight: "22.5 g",
    price: 289,
    packaging: "Velvet-lined box + care card",
    description:
      "Time-worn surface texture cast in gold plate — echoes of antiquity on the wrist.",
    images: {
      product:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      wearing:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    },
  },
  {
    id: "oa-001",
    code: "OA-NK-001",
    name: "Structure Collar",
    slug: "structure-collar",
    collectionSlug: "organic-architecture",
    category: "necklace",
    material: "silver",
    size: "38 cm",
    weight: "28.4 g",
    price: 312,
    packaging: "Velvet-lined box + care card",
    description:
      "Architectural collar where coral-like geometry meets sterling silver.",
    images: {
      product:
        "https://images.unsplash.com/photo-1617032219428-8f04d8bd251a?w=800&q=80",
      editorial:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    },
  },
  {
    id: "wn-001",
    code: "WN-RG-001",
    name: "Woven Lattice Ring",
    slug: "woven-lattice-ring",
    collectionSlug: "woven-by-nature",
    category: "ring",
    material: "silver",
    size: "US 6–8",
    weight: "5.9 g",
    price: 98,
    packaging: "Recycled cotton pouch + branded card",
    description:
      "Silent geometry woven into a lattice band — intricate yet minimal.",
    images: {
      product:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    },
  },
  {
    id: "misc-001",
    code: "DS-OT-001",
    name: "Tide Marker Brooch",
    slug: "tide-marker-brooch",
    collectionSlug: "golden-relics",
    category: "other",
    material: "black-rhodium",
    size: "45 × 28 mm",
    weight: "14.2 g",
    price: 167,
    packaging: "Velvet-lined box + care card",
    description:
      "A sculptural brooch marking the meeting of tide and time — for collectors.",
    images: {
      product:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    },
  },
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ring: "Ring",
  earring: "Earring",
  pendant: "Pendant",
  necklace: "Necklace",
  bracelet: "Bracelet",
  bangle: "Bangle",
  other: "Other",
};

export const MATERIAL_LABELS: Record<ProductMaterial, string> = {
  silver: "Sterling Silver",
  "gold-plated": "Gold Plated",
  "rose-gold-plated": "Rose Gold Plated",
  "black-rhodium": "Black Rhodium",
};

export function getFeaturedCollections() {
  return COLLECTIONS.filter((c) => c.isFeatured).sort(
    (a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
  );
}

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return PRODUCTS.filter((p) => p.collectionSlug === slug);
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function filterProducts(opts: {
  collection?: string;
  category?: ProductCategory;
  material?: ProductMaterial;
  search?: string;
}) {
  let list = [...PRODUCTS];
  if (opts.collection) {
    list = list.filter((p) => p.collectionSlug === opts.collection);
  }
  if (opts.category) {
    list = list.filter((p) => p.category === opts.category);
  }
  if (opts.material) {
    list = list.filter((p) => p.material === opts.material);
  }
  if (opts.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  return list;
}
