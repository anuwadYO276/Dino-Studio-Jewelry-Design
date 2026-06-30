import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "./_components/product-grid";
import {
  BRAND,
  COLLECTIONS,
  getFeaturedCollections,
} from "@/lib/mock-catalogue-data";

export default function ShowcasePage() {
  const featured = getFeaturedCollections();
  const coverCollection = featured[0];

  return (
    <>
      {/* API: GET /api/public/featured-collection → heroImage, tagline */}
      <section className="relative flex min-h-[85vh] items-end">
        <Image
          src={coverCollection.heroImage}
          alt={coverCollection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-white/70">
            Featured Collection
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-light tracking-wide text-white md:text-7xl">
            {coverCollection.name}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
            {coverCollection.tagline}
          </p>
          <Link
            href={`/showcase/collections/${coverCollection.slug}`}
            className="mt-8 inline-block border border-white px-6 py-3 text-xs tracking-[0.2em] uppercase text-white transition-colors hover:bg-white hover:text-neutral-900"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* API: GET /api/public/brand */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
          Our Story
        </p>
        <p className="mt-8 font-[family-name:var(--font-display)] text-2xl font-light leading-relaxed text-neutral-800 md:text-3xl">
          {BRAND.story}
        </p>
        <p className="mt-6 text-sm tracking-wide text-neutral-500">
          {BRAND.positioning}
        </p>
      </section>

      {/* Signature craft — static brand content, may stay CMS-managed */}
      <section className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&q=80"
              alt="Sandblasted silver texture detail"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
              Signature Detail
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-light text-neutral-900">
              Quiet luxury in every surface
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600">
              {BRAND.signature}
            </p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg italic text-neutral-400">
              {BRAND.keywords}
            </p>
          </div>
        </div>
      </section>

      {/* API: GET /api/public/collections?featured=true */}
      <section id="collections" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
            Collections
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-neutral-900">
            Nature · Memory · Imperfection · Soul
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((collection) => (
            <Link
              key={collection.slug}
              href={`/showcase/collections/${collection.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image
                  src={collection.heroImage}
                  alt={collection.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-neutral-900">
                  {collection.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  {collection.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {COLLECTIONS.filter((c) => !c.isFeatured).map((collection) => (
            <Link
              key={collection.slug}
              href={`/showcase/collections/${collection.slug}`}
              className="group border border-neutral-100 p-6 transition-colors hover:border-neutral-300"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-light text-neutral-900">
                {collection.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {collection.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial strip — API: GET /api/public/editorial-images */}
      <section className="grid md:grid-cols-3">
        {featured.map((collection, i) => (
          <div key={collection.slug} className="relative aspect-square">
            <Image
              src={collection.editorialImage}
              alt={`${collection.name} editorial`}
              fill
              sizes="33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-end bg-black/20 p-6">
              <p className="text-xs tracking-[0.2em] uppercase text-white">
                {String(i + 1).padStart(2, "0")} — {collection.mood}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section id="pieces" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
              All Pieces
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-light text-neutral-900">
              The Catalogue
            </h2>
          </div>
          <p className="text-sm text-neutral-500">
            {/* API: GET /api/public/products → total count */}
            Browse our full wholesale range
          </p>
        </div>
        <ProductGrid />
      </section>
    </>
  );
}
