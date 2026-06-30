import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_LABELS,
  MATERIAL_LABELS,
  getCollection,
  getProductsByCollection,
} from "@/lib/mock-catalogue-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  // API: GET /api/public/collections/:slug
  const collection = getCollection(slug);
  if (!collection) notFound();

  // API: GET /api/public/products?collection=:slug
  const products = getProductsByCollection(slug);

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
          <Link
            href="/showcase#collections"
            className="text-xs tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-white"
          >
            ← All Collections
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-light text-white md:text-6xl">
            {collection.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80">
            {collection.tagline}
          </p>
          <p className="mt-2 text-xs tracking-[0.2em] uppercase text-white/50">
            {collection.mood}
          </p>
        </div>
      </section>

      {/* API: editorialImage from collection record */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative aspect-[21/9] overflow-hidden">
          <Image
            src={collection.editorialImage}
            alt={`${collection.name} editorial`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <p className="mb-10 text-xs tracking-[0.2em] uppercase text-neutral-400">
          {/* API: products.length from API response meta.total */}
          {products.length} piece{products.length !== 1 ? "s" : ""} in this
          collection
        </p>

        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-400">
            Pieces coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
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
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-light">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {CATEGORY_LABELS[product.category]} ·{" "}
                    {MATERIAL_LABELS[product.material]}
                  </p>
                  <p className="text-sm text-neutral-700">
                    ${product.price}{" "}
                    <span className="text-neutral-400">wholesale</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
