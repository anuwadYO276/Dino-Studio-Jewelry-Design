import Image from "next/image";
import Link from "next/link";
import {
  HomeArrivalsSection,
  HomeCategorySection,
  HomeCollectionTiles,
  HomeFeaturedSection,
  HomeMetalsSection,
  HomeStorySection,
  HomeTestimonialsSection,
} from "./_components/home-blocks";
import { loadNewestProducts } from "./_lib/load-site-products";
import {
  BRAND,
  HOME_COVER_SLUGS,
  getCollection,
} from "@/lib/mock-catalogue-data";

export default async function HomePage() {
  const cover = getCollection(HOME_COVER_SLUGS[0]);
  const coverCollections = HOME_COVER_SLUGS.map(getCollection).filter(
    (c): c is NonNullable<typeof c> => c != null,
  );

  // ponytail: one window, then slice — same as old client offset hack
  const newest = await loadNewestProducts(0, 5);
  const arrivals = newest.slice(0, 3);
  const featuredSlice = newest.slice(3, 5);
  const featured =
    featuredSlice.length > 0 ? featuredSlice : newest.slice(0, 2);

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

      {/*
        True 50/50 like demo: left column full-height paper; right empty so
        section background-attachment:fixed shows through.
      */}
      <section
        className="home-hero-fixed relative min-h-0 lg:-mt-16 lg:min-h-[100svh]"
        style={{ backgroundImage: cover ? `url(${cover.heroImage})` : undefined }}
        aria-label={BRAND.name}
      >
        {cover && (
          <div className="relative aspect-[4/5] min-h-[45svh] w-full lg:hidden">
            <Image
              src={cover.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="relative z-10 grid min-h-0 grid-cols-1 lg:min-h-[100svh] lg:grid-cols-2">
          <div className="flex flex-col bg-[var(--hero-panel)] px-6 py-12 sm:px-10 lg:min-h-[100svh] lg:flex-col lg:items-end lg:justify-center lg:px-10 lg:pt-16 lg:pb-20 lg:pl-20 lg:pr-10 xl:pl-28 xl:pr-12">
            <div className="w-full max-w-[22rem] text-left sm:max-w-md lg:max-w-[26rem]">
              <h1 className="font-display text-[2.75rem] font-semibold leading-[1.15] tracking-normal text-neutral-900 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                {BRAND.name}
              </h1>
              <p className="mt-4 font-display text-lg font-normal italic leading-snug text-neutral-800 sm:text-xl md:text-2xl">
                {BRAND.homeHeroLine}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/pieces"
                  className="inline-block border border-neutral-900 px-6 py-3 text-[11px] tracking-[0.14em] uppercase text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  - Browse catalogue
                </Link>
                <Link href="/inquiry" className="text-link-editorial">
                  - Trade inquiry
                </Link>
              </div>
            </div>
          </div>
          {/* Right half: no fill — fixed background image shows here */}
          <div className="hidden min-h-[100svh] lg:block" aria-hidden />
        </div>
      </section>

      <HomeCategorySection />
      <HomeStorySection />
      <HomeArrivalsSection products={arrivals} />
      <HomeTestimonialsSection />
      <HomeCollectionTiles collections={coverCollections} />
      <HomeFeaturedSection products={featured} />
      <HomeMetalsSection />
    </>
  );
}
