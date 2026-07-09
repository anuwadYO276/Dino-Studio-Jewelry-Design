import type { ApiProduct, ApiProductImage, ApiVariant } from "@/lib/types/product";
import { getCollection } from "@/lib/mock-catalogue-data";

export const API_CATEGORY_LABELS: Record<string, string> = {
  earring: "Earring",
  bracelet: "Bracelet",
  necklace: "Necklace",
  ring: "Ring",
  pendant: "Pendant",
  set: "Set",
};

/** Prisma row → client ApiProduct (Decimal price → string, same as API JSON). */
export function toApiProduct(row: {
  id: string;
  name: string;
  description: string | null;
  category: string;
  collection: string | null;
  status: string;
  variants: Array<{
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    material: string | null;
    price: { toString(): string } | string | number;
    minOrder: number;
  }>;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}): ApiProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    collection: row.collection,
    status: row.status,
    variants: row.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      color: v.color,
      size: v.size,
      material: v.material,
      price: String(v.price),
      minOrder: v.minOrder,
    })),
    images: row.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
  };
}

export function getPrimaryImage(images: ApiProductImage[]) {
  return images.find((img) => img.isPrimary) ?? images[0] ?? null;
}

export function getMinPrice(variants: ApiVariant[]) {
  if (variants.length === 0) return null;
  return Math.min(...variants.map((v) => Number(v.price)));
}

export function formatCategory(category: string) {
  return API_CATEGORY_LABELS[category] ?? category;
}

/** MOCK collection slug → API product.collection string (name match) */
export function collectionNameFromSlug(slug: string) {
  return getCollection(slug)?.name ?? null;
}

export function variantLabel(variant: ApiVariant) {
  return (
    [variant.color, variant.size, variant.material]
      .filter(Boolean)
      .join(" · ") || variant.sku
  );
}

/** Card view model for product grids */
export function toProductCard(product: ApiProduct) {
  const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primary = getPrimaryImage(product.images);
  const minPrice = getMinPrice(product.variants);
  const material = product.variants[0]?.material ?? null;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    collection: product.collection,
    imageUrls: sorted.map((img) => img.url),
    imageAlt: primary?.altText ?? product.name,
    material,
    priceFrom: minPrice,
  };
}
