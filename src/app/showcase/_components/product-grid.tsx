"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  COLLECTIONS,
  MATERIAL_LABELS,
  type ProductCategory,
  type ProductMaterial,
  filterProducts,
} from "@/lib/mock-catalogue-data";

export function ProductGrid() {
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [material, setMaterial] = useState<ProductMaterial | "">("");
  const [search, setSearch] = useState("");

  const products = useMemo(
    () =>
      filterProducts({
        category: category || undefined,
        material: material || undefined,
        search: search || undefined,
      }),
    [category, material, search]
  );

  return (
    <div>
      {/* API: filters from GET /api/public/filters or derived from product facets */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          placeholder="Search by name or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none sm:max-w-xs"
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as ProductCategory | "")
          }
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          aria-label="Filter by category"
        >
          <option value="">All types</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={material}
          onChange={(e) =>
            setMaterial(e.target.value as ProductMaterial | "")
          }
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
          aria-label="Filter by material"
        >
          <option value="">All materials</option>
          {Object.entries(MATERIAL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {(category || material || search) && (
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setMaterial("");
              setSearch("");
            }}
            className="text-xs tracking-[0.15em] uppercase text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* API: GET /api/public/products with query params */}
      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          No pieces match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const collection = COLLECTIONS.find(
              (c) => c.slug === product.collectionSlug
            );
            return (
              <Link
                key={product.id}
                href={`/showcase/products/${product.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <Image
                    src={product.images.product}
                    alt={product.name}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">
                    {collection?.name}
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-light text-neutral-900">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {CATEGORY_LABELS[product.category]} ·{" "}
                    {MATERIAL_LABELS[product.material]}
                  </p>
                  {/* API: price visibility may depend on buyer tier / login */}
                  <p className="text-sm text-neutral-700">
                    ${product.price}{" "}
                    <span className="text-neutral-400">wholesale</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
