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
  const primary = getPrimaryImage(product.images);
  const minPrice = getMinPrice(product.variants);
  const material = product.variants[0]?.material ?? null;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    collection: product.collection,
    imageUrl: primary?.url ?? null,
    imageAlt: primary?.altText ?? product.name,
    material,
    priceFrom: minPrice,
    code: product.variants[0]?.sku ?? null,
  };
}
