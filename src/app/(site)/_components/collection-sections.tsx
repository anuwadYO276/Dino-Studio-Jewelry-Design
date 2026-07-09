/**
 * Collection page sections. Each collection's `layoutProfile`
 * (src/lib/collection-theme.ts) picks a hero + editorial pairing:
 *
 * | layoutProfile          | hero                       | editorial                     |
 * |------------------------|----------------------------|-------------------------------|
 * | botanical-split        | FullBleedHero (end)        | SplitEditorial (framed)       |
 * | petals-inset           | InsetHero                  | FramedEditorial               |
 * | bloom-cinematic        | FullBleedHero (end)        | CinematicEditorial            |
 * | gold-tribal-center     | FullBleedHero (center)     | FramedEditorial (wide)        |
 * | fragments-collage      | InsetHero                  | CollageEditorial              |
 * | relics-heritage        | FullBleedHero (start)      | HeritageEditorial             |
 * | architecture-structure | SplitHero                  | SplitEditorial (structure)    |
 * | woven-geometry         | SplitHero                  | GeometryEditorial             |
 *
 * Implementations: collection-heroes.tsx, collection-editorials.tsx, collection-shared.tsx
 */
import Link from "next/link";
import { CollectionMotif } from "./collection-motif";
import { CollectionPreview } from "./product-grid";
import {
  CinematicEditorial,
  CollageEditorial,
  FramedEditorial,
  GeometryEditorial,
  HeritageEditorial,
  SplitEditorial,
} from "./collection-editorials";
import { FullBleedHero, InsetHero, SplitHero } from "./collection-heroes";
import type { SectionProps } from "./collection-shared";
import {
  collectionTypeStyle,
  getFeaturedSectionStyle,
  heroUsesLightText,
  type CollectionTheme,
} from "@/lib/collection-theme";

export function CollectionHeroSection({
  collection,
  slug,
  theme,
}: SectionProps) {
  const headingStyle = collectionTypeStyle(theme);
  const onDark = heroUsesLightText(theme.layoutProfile);

  switch (theme.layoutProfile) {
    case "petals-inset":
    case "fragments-collage":
      return (
        <InsetHero
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
        />
      );
    case "architecture-structure":
    case "woven-geometry":
      return (
        <SplitHero
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
        />
      );
    default:
      return (
        <FullBleedHero
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
          onDark={onDark}
          align={HERO_ALIGN[theme.layoutProfile] ?? "end"}
        />
      );
  }
}

const HERO_ALIGN: Partial<Record<string, "start" | "end" | "center">> = {
  "relics-heritage": "start",
  "gold-tribal-center": "center",
};

export function CollectionEditorialSection({
  collection,
  theme,
}: Omit<SectionProps, "slug">) {
  const headingStyle = collectionTypeStyle(theme);

  switch (theme.layoutProfile) {
    case "botanical-split":
      return (
        <SplitEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    case "petals-inset":
      return (
        <FramedEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    case "bloom-cinematic":
      return (
        <CinematicEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    case "gold-tribal-center":
      return (
        <FramedEditorial collection={collection} theme={theme} headingStyle={headingStyle} wide />
      );
    case "fragments-collage":
      return (
        <CollageEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    case "relics-heritage":
      return (
        <HeritageEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    case "architecture-structure":
      return (
        <SplitEditorial
          collection={collection}
          theme={theme}
          headingStyle={headingStyle}
          variant="structure"
        />
      );
    case "woven-geometry":
      return (
        <GeometryEditorial collection={collection} theme={theme} headingStyle={headingStyle} />
      );
    default:
      return null;
  }
}

export function CollectionFeaturedSection({
  slug,
  collectionName,
  theme,
}: {
  slug: string;
  collectionName: string;
  theme: CollectionTheme;
}) {
  const style = getFeaturedSectionStyle(theme.layoutProfile);

  return (
    <section className="collection-surface">
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div
          className={`py-16 ${style.centered ? "text-center" : ""} ${
            style.borderAccent === "left"
              ? "border-l-4 pl-8 lg:pl-12"
              : style.borderAccent === "top"
                ? "border-t-4 pt-12"
                : ""
          }`}
          style={
            style.borderAccent !== "none"
              ? { borderColor: theme.accent }
              : undefined
          }
        >
          <p className="section-eyebrow mb-2 text-neutral-600">
            {style.sectionLabel}
          </p>
          <div
            className={`mb-10 h-px w-12 ${style.centered ? "mx-auto" : ""}`}
            style={{ backgroundColor: theme.accent }}
          />
          <div
            className="relative mb-10 h-20 overflow-hidden"
            aria-hidden
          >
            <CollectionMotif
              motif={theme.motif}
              color={theme.accent}
              opacity={style.motifOpacity}
            />
          </div>
          <CollectionPreview
            collectionSlug={slug}
            collectionName={collectionName}
            accentColor={theme.accent}
            limit={style.limit}
            gridClass={style.gridClass}
          />
        </div>
      </div>
    </section>
  );
}

export function CollectionInquiryStrip({
  slug,
  collectionName,
  theme,
}: {
  slug: string;
  collectionName: string;
  theme: CollectionTheme;
}) {
  return (
    <section
      className="border-t"
      style={{ borderColor: `${theme.accent}40` }}
    >
      <div
        className="collection-surface mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between lg:px-10"
      >
        <div>
          <p className="section-eyebrow">Wholesale</p>
          <p className="heading-display mt-2 text-xl md:text-2xl">
            {collectionName}
          </p>
          <p className="mt-2 max-w-md text-sm text-neutral-600">
            Request pricing and availability for international buyers.
          </p>
        </div>
        <Link
          href={`/inquiry?collection=${slug}`}
          className="btn-catalogue shrink-0 border px-8 py-4 transition-colors hover:bg-neutral-900 hover:text-white"
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          Request a wholesale quote
        </Link>
      </div>
    </section>
  );
}
