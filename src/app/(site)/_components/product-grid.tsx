"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApiProduct, ApiProductsResponse } from "@/lib/types/product";
import { collectionNameFromSlug, toProductCard } from "@/lib/catalogue-adapter";
import { getCollection } from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";
import {
  CatalogueToolbar,
  type CatalogueFilters,
} from "./catalogue-toolbar";
import {
  CATALOGUE_GRID_CLASS,
  PIECES_GRID_CLASS,
  ProductCard,
  ProductCardSkeleton,
} from "./product-card";

const PAGE_SIZE = 24;

export function ProductGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get("collection") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<CatalogueFilters>({
    category: "",
    material: "",
    search: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    const isLoadMore = page > 1;
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.material) params.set("material", filters.material);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    if (collectionName) params.set("collection", collectionName);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ApiProductsResponse = await res.json();
      if (data.success) {
        setProducts((prev) =>
          isLoadMore
            ? [...prev, ...data.data.products]
            : data.data.products
        );
        setTotal(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page, collectionName]);

  const replaceQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setPage(1);
    setFilters((f) =>
      f.category === categoryParam ? f : { ...f, category: categoryParam }
    );
  }, [categoryParam]);

  useEffect(() => {
    setPage(1);
  }, [collectionSlug]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    collectionSlug,
    filters.category,
    filters.material,
    filters.search,
    filters.sort,
  ]);

  const cards = useMemo(() => products.map(toProductCard), [products]);
  const hasMore = page < totalPages;
  const showClear = Boolean(
    filters.category || filters.material || filters.search
  );

  return (
    <div>
      {collectionMeta && collectionTheme ? (
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
          <span className="heading-display text-xl">{collectionMeta.name}</span>
          <Link href="/pieces" className="text-link ml-auto">
            View all pieces
          </Link>
        </div>
      ) : null}

      <CatalogueToolbar
        total={total}
        loadedCount={products.length}
        loading={loading && page === 1}
        filters={filters}
        onFiltersChange={(patch) => {
          setPage(1);
          if ("category" in patch) {
            replaceQuery((params) => {
              if (patch.category) params.set("category", patch.category);
              else params.delete("category");
            });
            return;
          }
          setFilters((f) => ({ ...f, ...patch }));
        }}
        onClear={() => {
          setPage(1);
          setFilters((f) => ({
            ...f,
            category: "",
            material: "",
            search: "",
            sort: "newest",
          }));
          replaceQuery((params) => {
            params.delete("category");
          });
        }}
        showClear={showClear}
      />

      {loading && page === 1 ? (
        <div className={PIECES_GRID_CLASS}>
          <ProductCardSkeleton count={8} />
        </div>
      ) : cards.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          No pieces match your filters.
        </p>
      ) : (
        <div className={PIECES_GRID_CLASS}>
          {cards.map((card) => (
            <ProductCard
              key={card.id}
              card={card}
              hideCollection={Boolean(collectionSlug)}
              imageSizes="(max-width:1024px) 50vw, 25vw"
            />
          ))}
        </div>
      )}

      {!loading && hasMore ? (
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-neutral-200 pt-10">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => setPage((p) => p + 1)}
            className="btn-catalogue btn-catalogue-outline min-w-[12rem] disabled:opacity-40"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Preview grid for collection pages — API: GET /api/products?collection= */
export function CollectionPreview({
  collectionSlug,
  collectionName,
  limit = 4,
  accentColor,
  gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
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
      <div className={`${CATALOGUE_GRID_CLASS} ${gridClass}`}>
        <ProductCardSkeleton count={limit} />
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
    <div className={`${CATALOGUE_GRID_CLASS} ${gridClass}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          card={toProductCard(product)}
          hideCollection
        />
      ))}
      <div
        className="catalogue-cell flex aspect-square items-center justify-center p-6"
        style={{
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
