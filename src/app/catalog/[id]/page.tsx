"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

interface Variant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  material: string | null;
  price: string;
  minOrder: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          if (data.data.variants.length > 0) {
            setSelectedVariant(data.data.variants[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-2/3" />
            <div className="h-4 bg-stone-100 rounded w-1/3" />
            <div className="h-20 bg-stone-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 text-lg">Product not found</p>
        <Link href="/catalog" className="text-stone-600 text-sm mt-2 underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-stone-400" aria-label="Breadcrumb">
        <Link href="/catalog" className="hover:text-stone-600 transition-colors">
          Collection
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === index
                      ? "border-stone-900"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-medium text-stone-900">
                {product.name}
              </h1>
              <p className="text-sm text-stone-400 capitalize mt-1">
                {product.category}
                {product.collection && ` · ${product.collection}`}
              </p>
            </div>
            {product.status !== "new_arrival" && (
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600 capitalize">
                {product.status.replace("_", " ")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-stone-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-stone-700 mb-3">
                Variants
              </h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-stone-900 bg-stone-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-stone-800">
                          {[variant.color, variant.size, variant.material]
                            .filter(Boolean)
                            .join(" · ") || variant.sku}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          SKU: {variant.sku}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">
                        ฿{Number(variant.price).toLocaleString()}
                      </p>
                    </div>
                    {variant.minOrder > 1 && (
                      <p className="text-xs text-stone-400 mt-1">
                        Min. order: {variant.minOrder} pcs
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry CTA */}
          <div className="mt-8">
            <Link
              href={`/catalog/inquiry?product=${product.id}${selectedVariant ? `&variant=${selectedVariant.id}` : ""}`}
              className="inline-flex items-center justify-center w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              Inquire About This Product
            </Link>
            <p className="text-xs text-stone-400 text-center mt-2">
              Our team will respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
