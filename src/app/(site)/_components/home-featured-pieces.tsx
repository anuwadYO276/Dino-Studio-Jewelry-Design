"use client";

import { useEffect, useState } from "react";
import type { ApiProduct, ApiProductsResponse } from "@/lib/types/product";
import { toProductCard } from "@/lib/catalogue-adapter";
import {
  ProductCard,
  ProductCardSkeleton,
} from "./product-card";

const LIMIT = 3;

const HOME_FEATURED_GRID_CLASS =
  "catalogue-grid grid-cols-1 lg:grid-cols-3";

/** Homepage featured grid — API images, no prices (wholesale spec) */
export function HomeFeaturedPieces() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: String(LIMIT),
          sort: "newest",
        });
        const res = await fetch(`/api/products?${params.toString()}`);
        const data: ApiProductsResponse = await res.json();
        if (data.success) setProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch featured pieces:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={HOME_FEATURED_GRID_CLASS}>
        <ProductCardSkeleton count={LIMIT} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-neutral-400">
        Pieces coming soon.
      </p>
    );
  }

  return (
    <div className={HOME_FEATURED_GRID_CLASS}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          card={toProductCard(product)}
          showPrice={false}
          imageSizes="(max-width:1024px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}
