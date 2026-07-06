"use client";

import { CATEGORY_LINKS } from "@/lib/mock-catalogue-data";

const CATEGORY_OPTIONS = [
  { value: "", label: "All types" },
  ...CATEGORY_LINKS.map((c) => ({ value: c.value, label: c.label })),
];

const MATERIAL_OPTIONS = [
  { value: "", label: "All materials" },
  { value: "925 Sterling Silver", label: "Sterling Silver" },
  { value: "Silver", label: "Silver" },
  { value: "18K Gold", label: "18K Gold" },
  { value: "14K Gold", label: "14K Gold" },
  { value: "Rose Gold", label: "Rose Gold" },
  { value: "Gold Plated", label: "Gold Plated" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "name_asc", label: "Name: A–Z" },
];

export interface CatalogueFilters {
  category: string;
  material: string;
  search: string;
  sort: string;
}

interface CatalogueToolbarProps {
  total: number;
  loadedCount: number;
  loading: boolean;
  filters: CatalogueFilters;
  onFiltersChange: (patch: Partial<CatalogueFilters>) => void;
  onClear: () => void;
  showClear: boolean;
}

export function CatalogueToolbar({
  total,
  loadedCount,
  loading,
  filters,
  onFiltersChange,
  onClear,
  showClear,
}: CatalogueToolbarProps) {
  const countLabel = loading
    ? "Loading…"
    : total === 0
      ? "0 pieces"
      : loadedCount < total
        ? `Showing ${loadedCount} of ${total}`
        : `${total} ${total === 1 ? "piece" : "pieces"}`;

  return (
    <div className="mb-10 border-b border-neutral-100 pb-6">
      <p className="meta-label mb-6">{countLabel}</p>

      <div className="flex flex-col gap-4 md:flex-row md:flex-nowrap md:items-end md:gap-x-8">
        <input
          type="search"
          placeholder="Search name or code…"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="catalogue-field w-full md:max-w-[14rem] md:shrink-0"
          aria-label="Search products"
        />
        <select
          value={filters.category}
          onChange={(e) => onFiltersChange({ category: e.target.value })}
          className="catalogue-field w-full md:w-auto md:shrink-0"
          aria-label="Filter by type"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.material}
          onChange={(e) => onFiltersChange({ material: e.target.value })}
          className="catalogue-field w-full md:w-auto md:shrink-0"
          aria-label="Filter by material"
        >
          {MATERIAL_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => onFiltersChange({ sort: e.target.value })}
          className="catalogue-field w-full md:ml-auto md:w-auto md:shrink-0"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="text-link shrink-0 pb-2 text-xs md:ml-0"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
