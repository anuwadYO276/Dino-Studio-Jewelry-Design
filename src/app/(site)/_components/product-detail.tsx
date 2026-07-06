"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type {
  ApiProduct,
  ApiProductResponse,
  ApiProductsResponse,
  ApiVariant,
} from "@/lib/types/product";
import {
  formatCategory,
  getPrimaryImage,
  variantLabel,
} from "@/lib/catalogue-adapter";
import { BRAND, COLLECTIONS, type ShowcaseCollection } from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";
import { CollectionInquiryStrip } from "./collection-sections";
import { ProductGallery } from "./product-gallery";

// MOCK: slug lookup by collection name — until API has collection slugs
const COLLECTIONS_BY_NAME = new Map(
  COLLECTIONS.map((c) => [c.name, c] as const)
);

interface Props {
  productId: string;
}

export function ProductDetail({ productId }: Props) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ApiVariant | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // MOCK: match API collection name → mock slug for back-link styling
  const collection: ShowcaseCollection | undefined = product?.collection
    ? COLLECTIONS_BY_NAME.get(product.collection)
    : undefined;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // API: GET /api/products/:id
        const res = await fetch(`/api/products/${productId}`);
        const data: ApiProductResponse = await res.json();
        if (!data.success) {
          setNotFound(true);
          return;
        }
        setProduct(data.data);
        if (data.data.variants.length > 0) {
          setSelectedVariant(data.data.variants[0]);
        }

        if (data.data.collection) {
          const relatedParams = new URLSearchParams({
            collection: data.data.collection,
            limit: "5",
          });
          const relatedRes = await fetch(
            `/api/products?${relatedParams.toString()}`
          );
          const relatedData: ApiProductsResponse = await relatedRes.json();
          if (relatedData.success) {
            setRelated(
              relatedData.data.products.filter((p) => p.id !== productId)
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square bg-neutral-50" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-neutral-100" />
            <div className="h-20 bg-neutral-50" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-neutral-400">Product not found</p>
        <Link href="/pieces" className="text-link mt-4 inline-block">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const theme = collection ? getCollectionTheme(collection.slug) : null;
  const accent = theme?.accent ?? "#171717";
  const variantSelected = (id: string) => selectedVariant?.id === id;

  return (
    <div
      style={
        theme
          ? ({
              "--collection-accent": theme.accent,
              "--collection-accent-muted": theme.accentMuted,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Link
          href={
            collection
              ? `/collections/${collection.slug}`
              : "/pieces"
          }
          className="text-link text-xs"
          style={theme ? { color: theme.accent } : undefined}
        >
          ← {collection?.name ?? "All pieces"}
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div>
          <ProductGallery
            images={images}
            productName={product.name}
            selectedIndex={selectedImage}
            onSelectIndex={setSelectedImage}
          />
        </div>

        <div className="lg:pt-8">
          <p className="meta-label">
            {collection ? (
              <Link
                href={`/collections/${collection.slug}`}
                className="transition-opacity hover:opacity-70"
                style={{ color: theme?.accent }}
              >
                {product.collection}
              </Link>
            ) : (
              (product.collection ?? "Dino studio")
            )}
          </p>
          <h1 className="heading-display mt-3 text-4xl md:text-5xl">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          )}

          <dl className="mt-10 space-y-4 border-t border-neutral-100 pt-10">
            {selectedVariant && (
              <DetailRow label="Product Code" value={selectedVariant.sku} />
            )}
            <DetailRow
              label="Type"
              value={formatCategory(product.category)}
            />
            {selectedVariant?.material && (
              <DetailRow label="Material" value={selectedVariant.material} />
            )}
            {selectedVariant?.size && (
              <DetailRow label="Size" value={selectedVariant.size} />
            )}
            {/* MOCK: no weight field on Product/Variant model */}
            {/* MOCK: no packaging field on Product model */}
            {selectedVariant && (
              <DetailRow
                label="Price"
                value={
                  <>
                    ${Number(selectedVariant.price).toLocaleString()}{" "}
                    <span className="text-neutral-400">wholesale</span>
                  </>
                }
              />
            )}
          </dl>

          {product.variants.length > 1 && (
            <div className="mt-8">
              <h3 className="form-label">
                Variants
              </h3>
              <div className="mt-4 space-y-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full border p-4 text-left text-sm transition-colors ${
                      variantSelected(variant.id)
                        ? "bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    style={
                      variantSelected(variant.id)
                        ? { borderColor: accent }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{variantLabel(variant)}</span>
                      <span className="font-medium">
                        ${Number(variant.price).toLocaleString()}
                      </span>
                    </div>
                    {variant.minOrder > 1 && (
                      <p className="mt-1 text-xs text-neutral-400">
                        Min. order: {variant.minOrder} pcs
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-xs leading-relaxed text-neutral-400">
            {BRAND.signature.slice(0, 120)}…
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={
                selectedVariant
                  ? `/inquiry?product=${productId}&variant=${selectedVariant.id}`
                  : `/inquiry?product=${productId}`
              }
              className="btn-catalogue btn-catalogue-solid inline-block px-8 py-4 text-center"
            >
              Request wholesale quote
            </Link>
            {collection && (
              <Link
                href={`/pieces?collection=${collection.slug}`}
                className="btn-catalogue btn-catalogue-outline inline-block px-8 py-4 text-center"
                style={
                  theme
                    ? { borderColor: theme.accent, color: theme.accent }
                    : undefined
                }
              >
                View collection
              </Link>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section
          className={`border-t border-neutral-100 ${theme ? "collection-surface" : "bg-neutral-50"}`}
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <h2 className="heading-display text-2xl">
              From the same collection
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.slice(0, 4).map((item) => {
                const img = getPrimaryImage(item.images);
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.altText ?? item.name}
                          fill
                          sizes="25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="heading-display mt-3 text-base">
                      {item.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {collection && theme && (
        <CollectionInquiryStrip
          slug={collection.slug}
          collectionName={collection.name}
          theme={theme}
        />
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="col-span-2 text-neutral-800">{value}</dd>
    </div>
  );
}