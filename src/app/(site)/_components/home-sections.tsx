import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionMotif } from "./collection-motif";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";
import {
  collectionTypeStyle,
  getCollectionTheme,
  type CollectionTheme,
  type HomeCtaStyle,
} from "@/lib/collection-theme";

export function HomeCoverTrilogy({
  collections,
}: {
  collections: ShowcaseCollection[];
}) {
  return (
    <section id="collections" className="border-b border-neutral-100">
      {collections.map((collection) => (
        <HomeEditorialCollection
          key={collection.slug}
          collection={collection}
        />
      ))}
    </section>
  );
}

function HomeEditorialCollection({
  collection,
}: {
  collection: ShowcaseCollection;
}) {
  const theme = getCollectionTheme(collection.slug);
  const href = `/collections/${collection.slug}`;
  const headingStyle = collectionTypeStyle(theme);
  const cta = {
    label: theme.homeCta ?? `${collection.name} →`,
    style: theme.homeCtaStyle ?? ("link" as const),
  };

  switch (theme.layoutProfile) {
    case "petals-inset":
      return (
        <HomePetalsInset
          collection={collection}
          theme={theme}
          href={href}
          headingStyle={headingStyle}
          cta={cta}
        />
      );
    case "bloom-cinematic":
      return (
        <HomeBloomCinematic
          collection={collection}
          theme={theme}
          href={href}
          headingStyle={headingStyle}
          cta={cta}
        />
      );
    default:
      return (
        <HomeBotanicalLead
          collection={collection}
          theme={theme}
          href={href}
          headingStyle={headingStyle}
          cta={cta}
        />
      );
  }
}

function HomeCollectionCta({
  label,
  style,
  onDark = true,
}: {
  label: string;
  style: HomeCtaStyle;
  onDark?: boolean;
}) {
  if (style === "minimal") {
    return (
      <span
        className={`mt-8 inline-block text-xs tracking-[0.22em] uppercase ${
          onDark
            ? "text-white/70 group-hover:text-white"
            : "text-neutral-500 group-hover:text-neutral-900"
        }`}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`text-link mt-6 inline-block text-sm underline-offset-4 ${
        onDark
          ? "text-white/80 group-hover:text-white"
          : "text-neutral-600 group-hover:text-neutral-900"
      }`}
    >
      {label}
    </span>
  );
}

/** botanical-split — full-bleed lead, copy bottom-left */
function HomeBotanicalLead({
  collection,
  theme,
  href,
  headingStyle,
  cta,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  href: string;
  headingStyle: CSSProperties;
  cta: { label: string; style: HomeCtaStyle };
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[65vh] overflow-hidden"
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
      <CollectionMotif motif={theme.motif} color="#ffffff" opacity={0.18} />
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ backgroundColor: theme.accent }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
        <p className="meta-label text-white/60">{collection.mood}</p>
        <h2
          className="heading-display mt-3 text-4xl text-white md:text-6xl lg:text-7xl"
          style={headingStyle}
        >
          {collection.name}
        </h2>
        <p
          className="mt-3 max-w-md font-display text-base font-light italic text-white/90 md:text-xl"
          style={headingStyle}
        >
          {collection.tagline}
        </p>
        <HomeCollectionCta label={cta.label} style={cta.style} />
      </div>
    </Link>
  );
}

/** petals-inset — split editorial: portrait image + copy panel */
function HomePetalsInset({
  collection,
  theme,
  href,
  headingStyle,
  cta,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  href: string;
  headingStyle: CSSProperties;
  cta: { label: string; style: HomeCtaStyle };
}) {
  return (
    <Link
      href={href}
      className="group grid min-h-0 border-t border-neutral-200 lg:min-h-[72vh] lg:grid-cols-2"
    >
      <div className="relative flex flex-col justify-center bg-white px-8 py-14 md:px-14 md:py-20 lg:px-16 lg:py-24">
        <div
          className="absolute top-0 left-0 hidden h-full w-px lg:block"
          style={{ backgroundColor: `${theme.accent}55` }}
        />
        <p className="meta-label" style={{ color: theme.accent }}>
          {collection.mood}
        </p>
        <h2
          className="heading-display mt-5 text-4xl text-neutral-900 md:text-5xl lg:text-6xl"
          style={headingStyle}
        >
          {collection.name}
        </h2>
        <p
          className="mt-6 max-w-sm font-display text-lg leading-relaxed text-neutral-600 md:text-xl"
          style={headingStyle}
        >
          {collection.tagline}
        </p>
        <HomeCollectionCta label={cta.label} style={cta.style} onDark={false} />
      </div>

      <div className="relative min-h-[75vw] overflow-hidden sm:min-h-[420px] lg:min-h-[72vh]">
        <Image
          src={collection.editorialImage}
          alt={collection.name}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
    </Link>
  );
}

/** bloom-cinematic — wide full-bleed, copy centered bottom */
function HomeBloomCinematic({
  collection,
  theme,
  href,
  headingStyle,
  cta,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  href: string;
  headingStyle: CSSProperties;
  cta: { label: string; style: HomeCtaStyle };
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[50vh] overflow-hidden border-t border-neutral-100 md:min-h-[55vh]"
    >
      <Image
        src={collection.editorialImage}
        alt={collection.name}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
      />
      <div
        className="absolute inset-0"
        style={{ background: theme.heroGradient }}
      />
      <CollectionMotif motif={theme.motif} color="#ffffff" opacity={0.15} />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-12 text-center md:pb-16 lg:pb-20">
        <h2
          className="heading-display max-w-3xl text-3xl text-white md:text-5xl lg:text-6xl"
          style={headingStyle}
        >
          {collection.name}
        </h2>
        <p
          className="mt-4 max-w-lg text-sm tracking-wide text-white/85 md:text-base"
          style={headingStyle}
        >
          {collection.tagline}
        </p>
        <HomeCollectionCta label={cta.label} style={cta.style} />
      </div>
    </Link>
  );
}
