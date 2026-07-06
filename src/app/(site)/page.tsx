import Image from "next/image";
import Link from "next/link";
import { HomeFeaturedPieces } from "./_components/home-featured-pieces";
import { HomeCoverTrilogy } from "./_components/home-sections";
import {
  BRAND,
  HOME_COVER_SLUGS,
  getCollection,
} from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";

export default function HomePage() {
  const coverCollections = HOME_COVER_SLUGS.map(getCollection).filter(
    (c): c is NonNullable<typeof c> => c != null,
  );
  const cover = coverCollections[0];
  const coverTheme = getCollectionTheme(cover.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    description: BRAND.story,
    slogan: BRAND.keywords,
    email: "silversand-bkk@hotmail.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative -mt-16 flex min-h-[100svh] items-end pt-16">
        <Image
          src={cover.heroImage}
          alt=""
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
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10 lg:pb-24">
          <h1 className="heading-display mt-4 text-5xl text-white md:text-7xl lg:text-8xl">
            Dino Studio
          </h1>
          <p className="mt-5 max-w-lg font-display text-xl font-light italic leading-relaxed text-white/90 md:text-2xl">
            {BRAND.homeHeroLine}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/pieces"
              className="btn-catalogue border-white bg-white text-neutral-900 transition-opacity hover:opacity-90"
            >
              Browse catalogue
            </Link>
            <Link
              href="/inquiry"
              className="btn-catalogue border-white/90 text-white transition-colors hover:bg-white hover:text-neutral-900"
            >
              Trade inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll border-t border-neutral-100">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 lg:py-28">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={BRAND.storyImage}
              alt="Ocean tide — inspiration for Dino Studio silver jewelry"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="heading-display text-3xl md:text-4xl">
              Shaped by tide, time, and nature
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-neutral-600">
              {BRAND.story}
            </p>
          </div>
        </div>
      </section>

      <HomeCoverTrilogy collections={coverCollections} />

      <section className="border-t border-neutral-100">
        <HomeFeaturedPieces />
        <div className="py-12 text-center">
          <Link href="/pieces" className="text-link">
            View full catalogue →
          </Link>
        </div>
      </section>
    </>
  );
}
