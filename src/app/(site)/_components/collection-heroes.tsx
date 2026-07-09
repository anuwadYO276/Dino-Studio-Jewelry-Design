import type { CSSProperties } from "react";
import Image from "next/image";
import { CollectionMotif } from "./collection-motif";
import { HeroIntro, type SectionProps } from "./collection-shared";

/** Full-screen image hero; `align` moves the copy block (start/end/center) */
export function FullBleedHero({
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

export function InsetHero({
  collection,
  slug,
  theme,
  headingStyle,
}: SectionProps & { headingStyle: CSSProperties }) {
  return (
    <section className="px-6 pt-10 lg:px-10 lg:pt-14">
      <div className="collection-surface mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
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

export function SplitHero({
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
