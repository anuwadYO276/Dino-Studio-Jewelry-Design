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
 * Shared building blocks: HeroIntro (hero copy), EditorialCopy (editorial copy).
 */
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionMotif } from "./collection-motif";
import { CollectionPreview } from "./product-grid";
import {
  collectionTypeStyle,
  getFeaturedSectionStyle,
  heroUsesLightText,
  type CollectionTheme,
} from "@/lib/collection-theme";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";

interface SectionProps {
  collection: ShowcaseCollection;
  slug: string;
  theme: CollectionTheme;
}

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

/** Shared hero copy block: back link, mood, name, tagline, CTA */
function HeroIntro({
  collection,
  slug,
  theme,
  headingStyle,
  onDark,
  centered = false,
}: {
  collection: ShowcaseCollection;
  slug: string;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
  onDark: boolean;
  centered?: boolean;
}) {
  const backLink = onDark
    ? "text-link text-white/70 hover:text-white"
    : "text-link";
  const center = centered ? "mx-auto" : "";

  return (
    <>
      <Link href="/#collections" className={`${backLink} text-sm`}>
        ← All collections
      </Link>
      <p
        className={`section-eyebrow mt-6 not-italic ${center}`}
        style={{ color: theme.accent }}
      >
        {collection.mood}
      </p>
      <h1
        className={`heading-display mt-3 text-5xl ${centered ? "md:text-7xl" : "md:text-6xl"} ${onDark ? "text-white" : "text-neutral-900"}`}
        style={headingStyle}
      >
        {collection.name}
      </h1>
      <p
        className={`mt-4 max-w-xl text-sm leading-relaxed ${center} ${onDark ? "text-white/85" : "text-neutral-700"}`}
        style={theme.typeAccent.italic ? { fontStyle: "italic" } : undefined}
      >
        {collection.tagline}
      </p>
      <Link
        href={`/pieces?collection=${slug}`}
        className={
          onDark
            ? `btn-catalogue-hero mt-8 ${center} hover:bg-[var(--collection-accent)]`
            : "btn-catalogue btn-catalogue-outline mt-8"
        }
        style={onDark ? { borderColor: theme.accent } : undefined}
      >
        View all pieces
      </Link>
    </>
  );
}

/** Shared editorial copy block: eyebrow, quoted tagline, mood paragraph */
function EditorialCopy({
  collection,
  theme,
  headingStyle,
  eyebrow = "Editorial",
  centered = false,
  className = "",
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
  eyebrow?: string | null;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className="section-eyebrow text-neutral-600">{eyebrow}</p>
      )}
      <p
        className="heading-display mt-6 text-2xl leading-relaxed text-neutral-900 md:text-3xl"
        style={headingStyle}
      >
        &ldquo;{collection.tagline}&rdquo;
      </p>
      {theme.moodCopy && (
        <p className="mt-8 text-sm leading-relaxed text-neutral-700">
          {theme.moodCopy}
        </p>
      )}
    </div>
  );
}

/** Full-screen image hero; `align` moves the copy block (start/end/center) */
function FullBleedHero({
  collection,
  slug,
  theme,
  headingStyle,
  onDark,
  align,
}: SectionProps & {
  headingStyle: CSSProperties;
  onDark: boolean;
  align: "start" | "end" | "center";
}) {
  // ponytail: ex-CenteredHero merged in — height normalized 80vh → 75vh
  const sectionAlign = {
    start: "items-start",
    end: "items-end",
    center: "items-center justify-center text-center",
  }[align];
  const contentClass =
    align === "center"
      ? "max-w-3xl py-20"
      : align === "start"
        ? "w-full max-w-7xl py-20 lg:px-10"
        : "w-full max-w-7xl pb-16 lg:px-10 lg:pb-20";

  return (
    <section className={`relative flex min-h-[75vh] ${sectionAlign}`}>
      <Image
        src={collection.heroImage}
        alt={collection.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ background: theme.heroGradient }} />
      <CollectionMotif motif={theme.motif} color="#ffffff" opacity={0.22} />
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{ backgroundColor: theme.accent }}
      />
      <div className={`relative z-10 mx-auto px-6 ${contentClass}`}>
        <HeroIntro
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
          onDark={onDark}
          centered={align === "center"}
        />
      </div>
    </section>
  );
}

function InsetHero({ collection, slug, theme, headingStyle }: SectionProps & { headingStyle: CSSProperties }) {
  return (
    <section className="px-6 pt-10 lg:px-10 lg:pt-14">
      <div
        className="collection-surface mx-auto max-w-6xl p-4 md:p-6 lg:p-8"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={collection.heroImage}
            alt={collection.name}
            fill
            priority
            sizes="(max-width:1280px) 100vw, 1152px"
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ background: theme.heroGradient }} />
          <CollectionMotif motif={theme.motif} color="#ffffff" opacity={0.22} />
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-2 pb-16 pt-12 lg:pb-20">
        <HeroIntro
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
          onDark={false}
        />
      </div>
    </section>
  );
}

function SplitHero({
  collection,
  slug,
  theme,
  headingStyle,
}: SectionProps & { headingStyle: CSSProperties }) {
  return (
    <section className="grid min-h-[75vh] lg:grid-cols-2">
      <div className="relative min-h-[45vh] lg:min-h-full">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover"
        />
        <CollectionMotif motif={theme.motif} color={theme.accent} />
      </div>
      <div className="collection-surface flex flex-col justify-end px-6 py-16 lg:px-12 lg:py-20">
        <HeroIntro
          collection={collection}
          slug={slug}
          theme={theme}
          headingStyle={headingStyle}
          onDark={false}
        />
      </div>
    </section>
  );
}

/**
 * Two-column editorial: copy + image.
 * - "framed": image in accent frame + tint, image-first on mobile (botanical-split)
 * - "structure": accent border-left, plain image (architecture-structure)
 */
function SplitEditorial({
  collection,
  theme,
  headingStyle,
  variant = "framed",
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
  variant?: "framed" | "structure";
}) {
  const framed = variant === "framed";

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      {/* ponytail: ex-StructureEditorial merged in — gap normalized 12 → 10 */}
      <div
        className={`grid gap-10 lg:grid-cols-2 lg:items-center ${framed ? "" : "border-l-4 pl-8 lg:pl-12"}`}
        style={framed ? undefined : { borderColor: theme.accent }}
      >
        <EditorialCopy
          collection={collection}
          theme={theme}
          headingStyle={headingStyle}
          eyebrow={framed ? "Editorial" : "Structure"}
          className={framed ? "order-2 lg:order-1" : ""}
        />
        <div
          className={`relative overflow-hidden ${framed ? "order-1 aspect-[4/5] lg:order-2" : "aspect-[4/3]"}`}
          style={framed ? { boxShadow: `inset 0 0 0 1px ${theme.accent}40` } : undefined}
        >
          <Image
            src={collection.editorialImage}
            alt={`${collection.name} editorial`}
            fill
            sizes="50vw"
            className="object-cover"
          />
          {framed && (
            <div className="absolute inset-0" style={{ backgroundColor: theme.editorialOverlay }} />
          )}
          <CollectionMotif motif={theme.motif} color={theme.accent} />
        </div>
      </div>
    </section>
  );
}

function FramedEditorial({
  collection,
  theme,
  headingStyle,
  wide = false,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
  wide?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="collection-surface p-4 md:p-8">
        <div className={`relative overflow-hidden ${wide ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
          <Image
            src={collection.editorialImage}
            alt={`${collection.name} editorial`}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: theme.editorialOverlay }} />
          <CollectionMotif motif={theme.motif} color={theme.accent} />
        </div>
        <EditorialCopy
          collection={collection}
          theme={theme}
          headingStyle={headingStyle}
          eyebrow={null}
          centered
          className="mx-auto max-w-2xl px-2 pt-4"
        />
      </div>
    </section>
  );
}

function CinematicEditorial({
  collection,
  theme,
  headingStyle,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={collection.editorialImage}
          alt={`${collection.name} editorial`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }}
        />
        <CollectionMotif motif={theme.motif} color="#ffffff" opacity={0.22} />
        <div className="absolute bottom-0 left-0 flex w-full flex-col gap-4 p-6 md:p-10">
          <p
            className="max-w-md font-display text-lg text-white md:text-xl"
            style={headingStyle}
          >
            {collection.tagline}
          </p>
          {theme.moodCopy && (
            <p className="max-w-lg text-sm leading-relaxed text-white/85">{theme.moodCopy}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function CollageEditorial({
  collection,
  theme,
  headingStyle,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
}) {
  const second = collection.editorialImage2 ?? collection.heroImage;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <EditorialCopy
          collection={collection}
          theme={theme}
          headingStyle={headingStyle}
          className="lg:col-span-4"
        />
        <div className="grid gap-4 lg:col-span-8 lg:grid-cols-5">
          <div
            className="relative aspect-[3/4] overflow-hidden lg:col-span-3"
            style={{ boxShadow: `inset 0 0 0 1px ${theme.accent}40` }}
          >
            <Image
              src={collection.editorialImage}
              alt={`${collection.name} editorial`}
              fill
              sizes="40vw"
              className="object-cover"
            />
            <CollectionMotif motif={theme.motif} color={theme.accent} />
          </div>
          <div
            className="relative aspect-square overflow-hidden lg:col-span-2 lg:mt-16"
            style={{ boxShadow: `inset 0 0 0 1px ${theme.accent}40` }}
          >
            <Image
              src={second}
              alt={`${collection.name} detail`}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeritageEditorial({
  collection,
  theme,
  headingStyle,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
}) {
  const detailImages = collection.editorialImage2
    ? [
        {
          src: collection.editorialImage2,
          alt: `${collection.name} sandblasted silver detail`,
          label: "Sandblasted finish",
        },
        {
          src: collection.heroImage,
          alt: `${collection.name} gold detail`,
          label: "Gold accent",
        },
      ]
    : null;

  return (
    <section className="border-t border-neutral-200">
      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={collection.editorialImage}
          alt={`${collection.name} editorial`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: theme.editorialOverlay }} />
      </div>
      <div className="collection-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="section-eyebrow not-italic text-neutral-600">The collection</p>
            <p
              className="heading-display mt-4 text-2xl text-neutral-900"
              style={headingStyle}
            >
              &ldquo;{collection.tagline}&rdquo;
            </p>
          </div>
          {theme.moodCopy && (
            <p className="text-sm leading-relaxed text-neutral-700 lg:pt-8">{theme.moodCopy}</p>
          )}
        </div>
        {detailImages && (
          <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
            <p className="section-eyebrow mb-6 not-italic text-neutral-600">Material story</p>
            <div className="grid gap-4 md:grid-cols-2">
              {detailImages.map(({ src, alt, label }) => (
                <div key={label}>
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ boxShadow: `inset 0 0 0 1px ${theme.accent}40` }}
                  >
                    <Image src={src} alt={alt} fill sizes="50vw" className="object-cover" />
                  </div>
                  <p className="meta-label mt-3 text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GeometryEditorial({
  collection,
  theme,
  headingStyle,
}: {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
}) {
  const cells = [
    collection.editorialImage,
    collection.heroImage,
    collection.editorialImage,
    collection.heroImage,
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <EditorialCopy
        collection={collection}
        theme={theme}
        headingStyle={headingStyle}
        eyebrow="Geometry"
        className="mb-10 max-w-xl"
      />
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {cells.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            <Image
              src={src}
              alt={`${collection.name} geometry ${i + 1}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
            {i === 0 && (
              <CollectionMotif motif={theme.motif} color={theme.accent} className="opacity-30" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
