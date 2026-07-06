"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toProductCard } from "@/lib/catalogue-adapter";

export type ProductCardData = ReturnType<typeof toProductCard>;

export const CATALOGUE_GRID_CLASS =
  "catalogue-grid grid-cols-2 lg:grid-cols-3";

/** /pieces catalogue — 4 columns on large screens */
export const PIECES_GRID_CLASS =
  "catalogue-grid grid-cols-2 lg:grid-cols-4";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function ProductCardGallery({
  productId,
  productName,
  imageUrls,
  imageAlt,
  imageSizes,
}: {
  productId: string;
  productName: string;
  imageUrls: string[];
  imageAlt: string;
  imageSizes: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const multi = imageUrls.length > 1;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + imageUrls.length) % imageUrls.length);
    },
    [imageUrls.length]
  );

  const stopNav = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (imageUrls.length === 0) {
    return (
      <div className="relative aspect-square bg-white">
        <div className="flex h-full items-center justify-center text-xs text-neutral-300">
          No image
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/gallery relative aspect-square overflow-hidden bg-white"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null || !multi) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
        touchStartX.current = null;
      }}
    >
      <div
        className="flex h-full motion-reduce:transition-none transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {imageUrls.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-square min-w-full shrink-0">
            <Image
              src={url}
              alt={i === index ? imageAlt : ""}
              fill
              sizes={imageSizes}
              className="object-contain p-6 md:p-8"
              aria-hidden={i !== index}
            />
          </div>
        ))}
      </div>

      <Link
        href={`/products/${productId}`}
        className="absolute inset-0 z-0"
        aria-label={`View ${productName}`}
      />

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              stopNav(e);
              go(-1);
            }}
            className="absolute top-1/2 left-1 z-10 -translate-y-1/2 p-2 text-neutral-400 opacity-0 transition-opacity group-hover/gallery:opacity-100 hover:text-neutral-900 focus-visible:opacity-100"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              stopNav(e);
              go(1);
            }}
            className="absolute top-1/2 right-1 z-10 -translate-y-1/2 p-2 text-neutral-400 opacity-0 transition-opacity group-hover/gallery:opacity-100 hover:text-neutral-900 focus-visible:opacity-100"
          >
            <ChevronIcon direction="right" />
          </button>
          <div className="pointer-events-none absolute right-0 bottom-3 left-0 z-10 flex justify-center gap-1.5">
            {imageUrls.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1} of ${imageUrls.length}`}
                aria-current={i === index ? "true" : undefined}
                onClick={(e) => {
                  stopNav(e);
                  setIndex(i);
                }}
                className="pointer-events-auto p-1"
              >
                <span
                  className={`block h-1 w-1 rounded-full transition-colors ${
                    i === index ? "bg-neutral-800" : "bg-neutral-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

interface ProductCardProps {
  card: ProductCardData;
  showPrice?: boolean;
  showDiscover?: boolean;
  hideCollection?: boolean;
  imageSizes?: string;
}

export function ProductCard({
  card,
  showPrice = true,
  showDiscover = true,
  hideCollection = false,
  imageSizes = "(max-width:640px) 50vw, 33vw",
}: ProductCardProps) {
  return (
    <article className="catalogue-cell group/card flex flex-col">
      <ProductCardGallery
        productId={card.id}
        productName={card.name}
        imageUrls={card.imageUrls}
        imageAlt={card.imageAlt}
        imageSizes={imageSizes}
      />
      <Link
        href={`/products/${card.id}`}
        className="flex flex-1 flex-col px-4 py-5 text-center"
      >
        {!hideCollection && card.collection ? (
          <p className="meta-label">{card.collection}</p>
        ) : null}
        <h3 className="heading-display text-base md:text-lg">{card.name}</h3>
        {card.material ? (
          <p className="mt-1.5 text-xs tracking-wide text-neutral-500">
            {card.material}
          </p>
        ) : null}
        {showPrice && card.priceFrom != null ? (
          <p className="mt-1.5 text-sm text-neutral-800">
            From ${card.priceFrom.toLocaleString()}
          </p>
        ) : null}
        {showDiscover ? (
          <p className="text-link mt-2 text-xs text-neutral-400 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
            Discover →
          </p>
        ) : null}
      </Link>
    </article>
  );
}

export function ProductCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="catalogue-cell animate-pulse">
          <div className="aspect-square bg-neutral-50" />
          <div className="space-y-2 px-4 py-5 text-center">
            <div className="mx-auto h-4 w-2/3 bg-neutral-100" />
            <div className="mx-auto h-3 w-1/2 bg-neutral-50" />
          </div>
        </div>
      ))}
    </>
  );
}
