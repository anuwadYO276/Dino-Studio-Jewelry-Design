"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiProduct, ApiProductsResponse } from "@/lib/types/product";
import { formatCategory, getPrimaryImage } from "@/lib/catalogue-adapter";

const LIMIT = 6;

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
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
        {Array.from({ length: LIMIT }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-400">
        Pieces coming soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
      {products.map((product) => {
        const primary = getPrimaryImage(product.images);
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
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : null}
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="heading-display text-lg">{product.name}</h3>
              <p className="text-xs text-neutral-500">
                {formatCategory(product.category)}
              </p>
              <p className="text-link mt-2 text-xs text-neutral-400 group-hover:text-neutral-900">
                View piece →
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
