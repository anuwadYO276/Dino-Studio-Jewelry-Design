"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BRAND,
  CATEGORY_LABELS,
  MATERIAL_LABELS,
  type ShowcaseCollection,
  type ShowcaseProduct,
} from "@/lib/mock-catalogue-data";

type ImageTab = "product" | "lifestyle" | "editorial" | "wearing";

interface Props {
  product: ShowcaseProduct;
  collection?: ShowcaseCollection;
  related: ShowcaseProduct[];
}

export function ProductDetail({ product, collection, related }: Props) {
  const imageTabs: { key: ImageTab; label: string; src: string }[] = [
    { key: "product", label: "Product", src: product.images.product },
    ...(product.images.lifestyle
      ? [
          {
            key: "lifestyle" as const,
            label: "Lifestyle",
            src: product.images.lifestyle,
          },
        ]
      : []),
    ...(product.images.editorial
      ? [
          {
            key: "editorial" as const,
            label: "Editorial",
            src: product.images.editorial,
          },
        ]
      : []),
    ...(product.images.wearing
      ? [
          {
            key: "wearing" as const,
            label: "Wearing",
            src: product.images.wearing,
          },
        ]
      : []),
  ];

  const [activeTab, setActiveTab] = useState<ImageTab>("product");
  const activeImage =
    imageTabs.find((t) => t.key === activeTab)?.src ?? product.images.product;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <Link
          href={
            collection
              ? `/showcase/collections/${collection.slug}`
              : "/showcase#pieces"
          }
          className="text-xs tracking-[0.2em] uppercase text-neutral-400 transition-colors hover:text-neutral-900"
        >
          ← {collection?.name ?? "All Pieces"}
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
            <Image
              key={activeImage}
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {imageTabs.length > 1 && (
            <>
              <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                {imageTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                      activeTab === tab.key
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-4">
                {imageTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative aspect-square overflow-hidden border-2 ${
                      activeTab === tab.key
                        ? "border-neutral-900"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={tab.src}
                      alt={tab.label}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:pt-8">
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
            {collection?.name}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-neutral-900 md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          <dl className="mt-10 space-y-4 border-t border-neutral-100 pt-10">
            <DetailRow label="Product Code" value={product.code} />
            <DetailRow label="Type" value={CATEGORY_LABELS[product.category]} />
            <DetailRow
              label="Material"
              value={MATERIAL_LABELS[product.material]}
            />
            <DetailRow label="Size" value={product.size} />
            <DetailRow label="Weight" value={product.weight} />
            <DetailRow label="Packaging" value={product.packaging} />
            <DetailRow
              label="Price"
              value={
                <>
                  ${product.price}{" "}
                  <span className="text-neutral-400">wholesale USD</span>
                </>
              }
            />
          </dl>

          <p className="mt-8 text-xs leading-relaxed text-neutral-400">
            {BRAND.signature.slice(0, 120)}…
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#inquiry"
              className="inline-block bg-neutral-900 px-8 py-4 text-center text-xs tracking-[0.2em] uppercase text-white transition-opacity hover:opacity-80"
            >
              Request Wholesale Quote
            </a>
            <Link
              href="/login"
              className="inline-block border border-neutral-200 px-8 py-4 text-center text-xs tracking-[0.2em] uppercase text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              Buyer Login
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-neutral-100 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-light text-neutral-900">
              From the same collection
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/showcase/products/${item.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                    <Image
                      src={item.images.product}
                      alt={item.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-base font-light">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
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
