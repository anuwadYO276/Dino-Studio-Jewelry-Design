import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HomeFeaturedPieces } from "./_components/home-featured-pieces";
import {
  CategoryStrip,
  ClientRelationsStrip,
  CollectionIconStrip,
  HomeCinematicCollection,
  RemainingCollectionsGrid,
} from "./_components/home-sections";
import {
  BRAND,
  COLLECTIONS,
  getFeaturedCollections,
} from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";

export default function HomePage() {
  const featured = getFeaturedCollections();
  const cover = featured[0];
  const coverTheme = getCollectionTheme(cover.slug);
  const cinematicCollections = featured.slice(1);
  const otherCollections = COLLECTIONS.filter((c) => !c.isFeatured);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    description: BRAND.story,
    slogan: BRAND.keywords,
    email: "wholesale@dinostudio.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero — Botanical Whispers, minimal text */}
      <section className="relative -mt-16 flex min-h-[100svh] items-end pt-16">
        <Image
          src={cover.heroImage}
          alt={cover.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: coverTheme.heroGradient }}
        />
        <div
          className="absolute bottom-0 left-0 h-px w-full"
          style={{ backgroundColor: coverTheme.accent }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10 lg:pb-28">
          <h1 className="heading-display mt-4 text-5xl text-white md:text-7xl lg:text-8xl">
            {cover.name}
          </h1>
          <p className="mt-5 max-w-md font-display text-xl font-light italic leading-relaxed text-white/90 md:text-2xl">
            {cover.tagline}
          </p>
          <Link
            href={`/collections/${cover.slug}`}
            className="btn-catalogue-hero mt-10 hover:bg-[var(--collection-accent)]"
            style={
              {
                borderColor: coverTheme.accent,
                "--collection-accent": coverTheme.accent,
              } as CSSProperties
            }
          >
            Explore collection
          </Link>
        </div>
      </section>

      <CollectionIconStrip collections={COLLECTIONS} />
      <CategoryStrip />

      {/* Brand story + cover narrative */}
      <section className="reveal-on-scroll mx-auto max-w-3xl px-6 py-28 text-center lg:px-10 lg:py-32">
        <p className="section-eyebrow">Our story</p>
        <p className="heading-display mt-10 text-2xl leading-relaxed text-neutral-800 md:text-3xl md:leading-relaxed">
          {BRAND.story}
        </p>
        <p className="mt-8 text-sm leading-relaxed text-neutral-600">
          {BRAND.coverNarrative}
        </p>
        <p className="mt-6 text-sm tracking-wide text-neutral-500">
          {BRAND.positioning}
        </p>
      </section>

      {/* Signature craft */}
      <section className="reveal-on-scroll border-t border-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={BRAND.signatureImage}
              alt="Sandblasted silver texture detail"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="section-eyebrow">Signature detail</p>
            <h2 className="heading-display mt-5 text-3xl md:text-4xl">
              Quiet luxury in every surface
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-neutral-600">
              {BRAND.signature}
            </p>
            <p className="mt-6 font-display text-lg italic text-neutral-400">
              {BRAND.keywords}
            </p>
          </div>
        </div>
      </section>

      {/* Featured editorials — Fallen Petals + Wild Bloom */}
      {cinematicCollections.map((collection) => (
        <HomeCinematicCollection key={collection.slug} collection={collection} />
      ))}

      <RemainingCollectionsGrid collections={otherCollections} />

      {/* Featured pieces — API, no prices */}
      <section className="border-t border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-eyebrow">Featured pieces</p>
              <h2 className="heading-display mt-3 text-3xl md:text-4xl">
                From the atelier
              </h2>
            </div>
            <Link href="/inquiry" className="btn-catalogue btn-catalogue-outline shrink-0">
              Request a wholesale quote
            </Link>
          </div>
          <HomeFeaturedPieces />
        </div>
      </section>

      <ClientRelationsStrip />
    </>
  );
}
