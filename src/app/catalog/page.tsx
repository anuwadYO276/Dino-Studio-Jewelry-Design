"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Variant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  collection: string | null;
  status: string;
  variants: Variant[];
  images: ProductImage[];
}

interface Filters {
  categories: string[];
  materials: string[];
  sizes: string[];
  statuses: string[];
  search: string;
  sort: string;
}

// ตัวเลือก filter
const CATEGORY_OPTIONS = [
  { value: "earring", label: "ตุ้มหู" },
  { value: "bracelet", label: "กำไล" },
  { value: "necklace", label: "สร้อย" },
  { value: "ring", label: "แหวน" },
  { value: "pendant", label: "จี้" },
  { value: "set", label: "เซ็ต" },
];

const MATERIAL_OPTIONS = [
  { value: "ทอง", label: "ทอง" },
  { value: "เงิน", label: "เงิน" },
  { value: "พลาสติก", label: "พลาสติก" },
  { value: "18K Gold", label: "18K Gold" },
  { value: "14K Gold", label: "14K Gold" },
  { value: "925 Sterling Silver", label: "925 Silver" },
  { value: "Rose Gold", label: "Rose Gold" },
];

const SIZE_OPTIONS = [
  { value: "small", label: "ขนาดเล็ก" },
  { value: "medium", label: "ขนาดกลาง" },
  { value: "large", label: "ขนาดใหญ่" },
  { value: "free_size", label: "Free Size" },
];

const STATUS_OPTIONS = [
  { value: "new_arrival", label: "สินค้าใหม่" },
  { value: "seasonal", label: "สินค้าเทศกาล" },
  { value: "sale", label: "สินค้าลดราคา" },
];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        active
          ? "bg-stone-900 text-white border-stone-900"
          : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800"
      }`}
    >
      {label}
    </button>
  );
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    materials: [],
    sizes: [],
    statuses: [],
    search: "",
    sort: "newest",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const toggleFilter = (
    key: "categories" | "materials" | "sizes" | "statuses",
    value: string
  ) => {
    setFilters((f) => {
      const current = f[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...f, [key]: next };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      materials: [],
      sizes: [],
      statuses: [],
      search: "",
      sort: "newest",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const activeFilterCount =
    filters.categories.length +
    filters.materials.length +
    filters.sizes.length +
    filters.statuses.length;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams();

    if (filters.categories.length > 0)
      params.set("category", filters.categories.join(","));
    if (filters.materials.length > 0)
      params.set("material", filters.materials.join(","));
    if (filters.sizes.length > 0)
      params.set("size", filters.sizes.join(","));
    if (filters.statuses.length > 0)
      params.set("status", filters.statuses.join(","));
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(pagination.page));

    try {
      const res = await fetch(`/api/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.data.pagination.totalPages,
          total: data.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getMinPrice = (variants: Variant[]) => {
    if (variants.length === 0) return null;
    return Math.min(...variants.map((v) => Number(v.price)));
  };

  const getPrimaryImage = (images: ProductImage[]) => {
    return images.find((img) => img.isPrimary) || images[0];
  };

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-stone-800 tracking-wide">
            Collection
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {pagination.total} ชิ้น
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={filters.search}
              onChange={(e) => {
                setFilters((f) => ({ ...f, search: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 outline-none w-56"
            />
          </div>
          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value }))
            }
            className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white focus:border-stone-400 outline-none"
            aria-label="เรียงตาม"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price_asc">ราคา: ต่ำ → สูง</option>
            <option value="price_desc">ราคา: สูง → ต่ำ</option>
            <option value="name_asc">ชื่อ: A-Z</option>
          </select>
          {/* Toggle filter */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              showFilters
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            ตัวกรอง
            {activeFilterCount > 0 && (
              <span className="bg-white text-stone-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8 bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-700">กรองสินค้า</h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                ล้างตัวกรองทั้งหมด ({activeFilterCount})
              </button>
            )}
          </div>

          {/* ประเภทสินค้า */}
          <div>
            <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              ประเภทสินค้า
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.categories.includes(opt.value)}
                  onClick={() => toggleFilter("categories", opt.value)}
                />
              ))}
            </div>
          </div>

          {/* วัสดุ */}
          <div>
            <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              วัสดุ
            </h3>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.materials.includes(opt.value)}
                  onClick={() => toggleFilter("materials", opt.value)}
                />
              ))}
            </div>
          </div>

          {/* ขนาด */}
          <div>
            <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              ขนาด
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.sizes.includes(opt.value)}
                  onClick={() => toggleFilter("sizes", opt.value)}
                />
              ))}
            </div>
          </div>

          {/* สถานะ / ช่วงเวลา */}
          <div>
            <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              ช่วงเวลา
            </h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.value}
                  label={opt.label}
                  active={filters.statuses.includes(opt.value)}
                  onClick={() => toggleFilter("statuses", opt.value)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filter tags (visible when filter panel is hidden) */}
      {!showFilters && activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-stone-400">กรอง:</span>
          {filters.categories.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700"
            >
              {CATEGORY_OPTIONS.find((o) => o.value === v)?.label}
              <button
                onClick={() => toggleFilter("categories", v)}
                className="text-stone-400 hover:text-stone-700"
                aria-label={`ลบตัวกรอง ${v}`}
              >
                ×
              </button>
            </span>
          ))}
          {filters.materials.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700"
            >
              {v}
              <button
                onClick={() => toggleFilter("materials", v)}
                className="text-stone-400 hover:text-stone-700"
                aria-label={`ลบตัวกรอง ${v}`}
              >
                ×
              </button>
            </span>
          ))}
          {filters.sizes.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700"
            >
              {SIZE_OPTIONS.find((o) => o.value === v)?.label}
              <button
                onClick={() => toggleFilter("sizes", v)}
                className="text-stone-400 hover:text-stone-700"
                aria-label={`ลบตัวกรอง ${v}`}
              >
                ×
              </button>
            </span>
          ))}
          {filters.statuses.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700"
            >
              {STATUS_OPTIONS.find((o) => o.value === v)?.label}
              <button
                onClick={() => toggleFilter("statuses", v)}
                className="text-stone-400 hover:text-stone-700"
                aria-label={`ลบตัวกรอง ${v}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 ml-2"
          >
            ล้างทั้งหมด
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-stone-200 rounded-xl aspect-square" />
              <div className="mt-3 h-4 bg-stone-200 rounded w-3/4" />
              <div className="mt-2 h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-lg">ไม่พบสินค้า</p>
          <p className="text-stone-300 text-sm mt-1">
            ลองปรับตัวกรองใหม่
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const primaryImage = getPrimaryImage(product.images);
            const minPrice = getMinPrice(product.variants);

            return (
              <Link
                key={product.id}
                href={`/catalog/${product.id}`}
                className="group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.altText || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Status badge */}
                  {product.status === "seasonal" && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-amber-50/90 backdrop-blur-sm rounded-md text-xs font-medium text-amber-700">
                      เทศกาล
                    </span>
                  )}
                  {product.status === "sale" && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-red-50/90 backdrop-blur-sm rounded-md text-xs font-medium text-red-600">
                      ลดราคา
                    </span>
                  )}
                  {product.status === "new_arrival" && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-50/90 backdrop-blur-sm rounded-md text-xs font-medium text-green-700">
                      ใหม่
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-stone-800 group-hover:text-stone-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label || product.category}
                    {product.collection && ` · ${product.collection}`}
                  </p>
                  {minPrice !== null && (
                    <p className="text-sm font-medium text-stone-700 mt-1">
                      ฿{minPrice.toLocaleString()}
                      {product.variants.length > 1 && " ~"}
                    </p>
                  )}
                  {product.variants.length > 1 && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {product.variants.length} แบบ
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="w-10 h-10 rounded-lg text-sm font-medium bg-white text-stone-600 border border-stone-200 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: i + 1 }))
              }
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                pagination.page === i + 1
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.totalPages, prev.page + 1),
              }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="w-10 h-10 rounded-lg text-sm font-medium bg-white text-stone-600 border border-stone-200 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
