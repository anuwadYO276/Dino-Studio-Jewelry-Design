import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CATEGORY_LINKS } from "@/lib/mock-catalogue-data";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";

export function CollectionIconStrip({
  collections,
}: {
  collections: ShowcaseCollection[];
}) {
  return (
    <section id="collections" className="border-b border-neutral-100 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-eyebrow mb-6 text-center">The collections</p>
        <div className="strip-scroll flex snap-x snap-mandatory gap-x-10 gap-y-4 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
          {collections.map((c) => {
            const theme = getCollectionTheme(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="heading-display shrink-0 snap-start text-xl lowercase text-neutral-800 transition-colors hover:text-[var(--collection-accent)] md:text-2xl"
                style={{ "--collection-accent": theme.accent } as CSSProperties}
              >
                {c.name.toLowerCase()}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CategoryStrip() {
  return (
    <section className="border-b border-neutral-100 py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-eyebrow mb-5 text-center">Browse by form</p>
        <div className="strip-scroll flex snap-x snap-mandatory justify-start gap-x-8 overflow-x-auto pb-1 md:justify-center md:overflow-visible">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.value}
              href={`/pieces?category=${cat.value}`}
              className="nav-label shrink-0 snap-start text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCinematicCollection({
  collection,
}: {
  collection: ShowcaseCollection;
}) {
  const theme = getCollectionTheme(collection.slug);

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block min-h-[55vh] overflow-hidden"
    >
      <Image
        src={collection.editorialImage}
        alt={collection.name}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
      />
      <div
        className="absolute inset-0"
        style={{ background: theme.heroGradient }}
      />
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ backgroundColor: theme.accent }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14">
        <p
          className="section-eyebrow not-italic text-white/70"
          style={{ color: theme.accent }}
        >
          {collection.mood}
        </p>
        <h2 className="heading-display mt-3 text-4xl text-white md:text-5xl lg:text-6xl">
          {collection.name}
        </h2>
        <p className="mt-3 max-w-md font-display text-base font-light italic text-white/90 md:text-lg">
          {collection.tagline}
        </p>
        <span className="text-link mt-6 inline-block text-sm text-white/80 underline-offset-4 group-hover:text-white">
          View collection →
        </span>
      </div>
    </Link>
  );
}

export function RemainingCollectionsGrid({
  collections,
}: {
  collections: ShowcaseCollection[];
}) {
  return (
    <section className="border-t border-neutral-100 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="section-eyebrow">More collections</p>
        <h2 className="heading-display mt-4 text-3xl md:text-4xl">
          Discover the full range
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => {
            const theme = getCollectionTheme(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group overflow-hidden bg-white"
                style={{ boxShadow: `inset 0 -3px 0 0 ${theme.accent}` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.editorialImage}
                    alt={c.name}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ backgroundColor: theme.editorialOverlay }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="heading-display text-lg">{c.name}</h3>
                  <p className="mt-2 font-display text-sm font-light italic text-neutral-500">
                    {c.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClientRelationsStrip() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-3 lg:px-10">
        <div>
          <p className="section-eyebrow text-neutral-500">Wholesale</p>
          <h2 className="heading-display mt-4 text-2xl text-white md:text-3xl">
            Client relations
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            For international buyers across Europe, Australia, USA, Asia and
            beyond.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <a
            href="mailto:silversand-bkk@hotmail.com"
            className="text-sm tracking-wide text-white underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            silversand-bkk@hotmail.com
          </a>
          <Link
            href="/inquiry"
            className="text-sm tracking-wide text-white underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Request a wholesale quote →
          </Link>
        </div>
        <div className="flex flex-col justify-center md:items-end">
          <Link
            href="/pieces"
            className="btn-catalogue border-white text-white hover:bg-white hover:text-neutral-900"
          >
            View the catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
