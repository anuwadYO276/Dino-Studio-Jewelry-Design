import type { CSSProperties } from "react";
import Link from "next/link";
import type { CollectionTheme } from "@/lib/collection-theme";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";

export interface SectionProps {
  collection: ShowcaseCollection;
  slug: string;
  theme: CollectionTheme;
}

/** Shared hero copy block: back link, mood, name, tagline, CTA */
export function HeroIntro({
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
export function EditorialCopy({
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
