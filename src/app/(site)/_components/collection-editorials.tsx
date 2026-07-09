import type { CSSProperties } from "react";
import Image from "next/image";
import { CollectionMotif } from "./collection-motif";
import { EditorialCopy } from "./collection-shared";
import type { CollectionTheme } from "@/lib/collection-theme";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";

type EditorialProps = {
  collection: ShowcaseCollection;
  theme: CollectionTheme;
  headingStyle: CSSProperties;
};

/**
 * Two-column editorial: copy + image.
 * - "framed": image in accent frame + tint, image-first on mobile (botanical-split)
 * - "structure": accent border-left, plain image (architecture-structure)
 */
export function SplitEditorial({
  collection,
  theme,
  headingStyle,
  variant = "framed",
}: EditorialProps & { variant?: "framed" | "structure" }) {
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

export function FramedEditorial({
  collection,
  theme,
  headingStyle,
  wide = false,
}: EditorialProps & { wide?: boolean }) {
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

export function CinematicEditorial({
  collection,
  theme,
  headingStyle,
}: EditorialProps) {
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

export function CollageEditorial({
  collection,
  theme,
  headingStyle,
}: EditorialProps) {
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

export function HeritageEditorial({
  collection,
  theme,
  headingStyle,
}: EditorialProps) {
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

export function GeometryEditorial({
  collection,
  theme,
  headingStyle,
}: EditorialProps) {
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
