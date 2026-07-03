"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ApiProduct, ApiProductsResponse } from "@/lib/types/product";
import {
  collectionNameFromSlug,
  formatCategory,
  getPrimaryImage,
  getMinPrice,
  toProductCard,
} from "@/lib/catalogue-adapter";
import { CATEGORY_LINKS, getCollection } from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";

const CATEGORY_OPTIONS = CATEGORY_LINKS.map((c) => ({
  value: c.value,
  label: c.label,
}));

const MATERIAL_OPTIONS = [
  { value: "925 Sterling Silver", label: "Sterling Silver" },
  { value: "Silver", label: "Silver" },
  { value: "18K Gold", label: "18K Gold" },
  { value: "14K Gold", label: "14K Gold" },
  { value: "Rose Gold", label: "Rose Gold" },
  { value: "Gold Plated", label: "Gold Plated" },
];

const PAGE_SIZE = 24;

interface Filters {
  category: string;
  material: string;
  search: string;
  sort: string;
}

export function ProductGrid() {
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get("collection") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  // MOCK: collection metadata from slug; API uses product.collection name string
  const collectionMeta = collectionSlug
    ? getCollection(collectionSlug)
    : undefined;
  const collectionName = collectionSlug
    ? collectionNameFromSlug(collectionSlug)
    : null;
  const collectionTheme = collectionSlug
    ? getCollectionTheme(collectionSlug)
    : null;

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    material: "",
    search: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.material) params.set("material", filters.material);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    if (collectionName) params.set("collection", collectionName);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    try {
      // API: GET /api/products
      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ApiProductsResponse = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        setTotal(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, collectionName]);

  useEffect(() => {
    setFilters((f) =>
      f.category === categoryParam ? f : { ...f, category: categoryParam }
    );
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [collectionSlug, filters.category, filters.material, filters.search, filters.sort]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const cards = useMemo(() => products.map(toProductCard), [products]);
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      {collectionMeta && collectionTheme && (
        <div
          className="mb-8 flex flex-wrap items-center gap-3 border-b pb-8"
          style={{ borderColor: `${collectionTheme.accent}40` }}
        >
          <p
            className="section-eyebrow not-italic"
            style={{ color: collectionTheme.accent }}
          >
            Collection
          </p>
          <span className="heading-display text-xl">
            {collectionMeta.name}
          </span>
          <Link href="/pieces" className="text-link ml-auto">
            View all pieces
          </Link>
        </div>
      )}

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          placeholder="Search by name or code…"
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none sm:max-w-xs"
          aria-label="Search products"
        />
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          aria-label="Filter by category"
        >
          <option value="">All types</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.material}
          onChange={(e) =>
            setFilters((f) => ({ ...f, material: e.target.value }))
          }
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          aria-label="Filter by material"
        >
          <option value="">All materials</option>
          {MATERIAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low → high</option>
          <option value="price_desc">Price: high → low</option>
          <option value="name_asc">Name: A–Z</option>
        </select>
        {(filters.category || filters.material || filters.search) && (
          <button
            type="button"
            onClick={() =>
              setFilters({ category: "", material: "", search: "", sort: "newest" })
            }
            className="text-link text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="meta-label mb-8">
        {loading
          ? "Loading…"
          : total === 0
            ? "0 pieces"
            : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-neutral-100" />
              <div className="mt-4 h-4 w-2/3 bg-neutral-100" />
              <div className="mt-2 h-3 w-1/2 bg-neutral-50" />
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          No pieces match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/products/${card.id}`}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-300">
                    No image
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-1">
                {card.collection && (
                  <p className="meta-label">
                    {card.collection}
                  </p>
                )}
                <h3 className="heading-display text-lg">
                  {card.name}
                </h3>
                <p className="text-xs text-neutral-500">
                  {formatCategory(card.category)}
                  {card.material ? ` · ${card.material}` : ""}
                </p>
                {card.priceFrom != null && (
                  <p className="text-sm text-neutral-700">
                    ${card.priceFrom}{" "}
                    <span className="text-neutral-400">wholesale</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    return [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <nav
      className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-neutral-100 pt-12"
      aria-label="Catalogue pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="text-link px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev != null && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-2 text-neutral-300">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`min-w-[2.5rem] px-3 py-2 text-xs tracking-[0.1em] transition-colors ${
                  p === page
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="text-link px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  );
}

/** Preview grid for collection pages — API: GET /api/products?collection= */
export function CollectionPreview({
  collectionSlug,
  collectionName,
  limit = 4,
  accentColor,
  gridClass = "grid-cols-2 md:grid-cols-4",
}: {
  collectionSlug: string;
  collectionName: string;
  limit?: number;
  accentColor?: string;
  gridClass?: string;
}) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          collection: collectionName,
          limit: String(limit),
        });
        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ApiProductsResponse = await res.json();
        if (data.success) setProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch collection preview:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [collectionName, limit]);

  if (loading) {
    return (
      <div className={`grid gap-6 ${gridClass}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-neutral-400">
        Pieces coming soon.
      </p>
    );
  }

  return (
    <div className={`grid gap-x-6 gap-y-12 ${gridClass}`}>
      {products.map((product) => {
        const primary = getPrimaryImage(product.images);
        const minPrice = getMinPrice(product.variants);
        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {primary ? (
                <Image
                  src={primary.url}
                  alt={primary.altText ?? product.name}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="heading-display text-lg">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-500">
                {formatCategory(product.category)}
              </p>
              {minPrice != null && (
                <p className="text-sm text-neutral-700">
                  ${minPrice}{" "}
                  <span className="text-neutral-400">wholesale</span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
      <div
        className="flex aspect-[3/4] items-center justify-center border p-6"
        style={{
          borderColor: accentColor ? `${accentColor}60` : undefined,
          backgroundColor: accentColor ? `${accentColor}08` : undefined,
        }}
      >
        <Link
          href={`/pieces?collection=${collectionSlug}`}
          className="text-link text-center text-sm"
          style={{ color: accentColor ?? undefined }}
        >
          View all pieces
          <br />
          in this collection →
        </Link>
      </div>
    </div>
  );
}
