import Image from "next/image";
import Link from "next/link";
import type { ApiProduct } from "@/lib/types/product";
import type { ShowcaseCollection } from "@/lib/mock-catalogue-data";
import {
  BRAND,
  HOME_CATEGORY_TILES,
  HOME_METALS,
  HOME_TESTIMONIALS,
} from "@/lib/mock-catalogue-data";
import { HomeProductGrid } from "./home-product-grid";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-12 flex flex-col items-center gap-4 text-center">
      <h2 className="heading-display text-3xl md:text-4xl">{title}</h2>
      {href && linkLabel ? (
        <Link href={href} className="text-link-editorial">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

/** 2 — Category: 3 image tiles + view all types */
export function HomeCategorySection() {
  return (
    <section className="reveal-on-scroll border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <SectionHeader
          title="Shop by category"
          href="/pieces"
          linkLabel="- View all types"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {HOME_CATEGORY_TILES.map((tile) => (
            <li key={tile.value}>
              <Link
                href={`/pieces?category=${tile.value}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="heading-display mt-4 text-center text-xl md:text-2xl">
                  {tile.label}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 3 — Story: existing split, spacing only */
export function HomeStorySection() {
  return (
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
          <div className="mt-8 h-px w-12 bg-[var(--brand-accent)]" />
          <p className="mt-8 text-sm leading-relaxed text-neutral-600">
            {BRAND.story}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Shared product row shell — Arrivals / Featured differ only by grid props */
function HomeProductRow({
  title,
  products,
  gridClassName,
  imageSizes,
}: {
  title: string;
  products: ApiProduct[];
  gridClassName: string;
  imageSizes: string;
}) {
  return (
    <section className="border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <SectionHeader title={title} href="/pieces" linkLabel="- View all" />
        <HomeProductGrid
          products={products}
          gridClassName={gridClassName}
          imageSizes={imageSizes}
          showPrice
        />
      </div>
    </section>
  );
}

/** 4 — Arrivals: newest, 3-col */
export function HomeArrivalsSection({ products }: { products: ApiProduct[] }) {
  return (
    <HomeProductRow
      title="New arrivals"
      products={products}
      gridClassName="catalogue-grid grid-cols-1 sm:grid-cols-3"
      imageSizes="(max-width:640px) 100vw, 33vw"
    />
  );
}

/** 5 — Testimonials: mock B2B quotes */
export function HomeTestimonialsSection() {
  const primary = HOME_TESTIMONIALS[0];
  return (
    <section className="reveal-on-scroll border-t border-neutral-100 bg-[var(--brand-accent-muted)]">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10 lg:py-28">
        <p
          className="font-display text-6xl font-light leading-none text-[var(--brand-accent)]"
          aria-hidden
        >
          “
        </p>
        <p className="section-eyebrow mt-2">Testimonials</p>
        <blockquote className="mt-8">
          <p className="heading-display text-2xl leading-snug text-neutral-800 md:text-3xl">
            {primary.quote}
          </p>
          <footer className="mt-10">
            <div className="section-hairline" />
            <p className="mt-6 text-sm text-neutral-600">
              {primary.name}
              <span className="text-neutral-400"> — {primary.role}</span>
            </p>
            <p className="mt-1 text-xs tracking-wide text-neutral-400">
              {primary.place}
            </p>
          </footer>
        </blockquote>
        {/* ponytail: show one quote on home; full list lives in mock for later carousel */}
        <ul className="sr-only">
          {HOME_TESTIMONIALS.map((t) => (
            <li key={t.name}>
              {t.quote} — {t.name}, {t.place}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 6 — Uniform tall collection tiles (home only; grill: B) — sized near demo */
export function HomeCollectionTiles({
  collections,
}: {
  collections: ShowcaseCollection[];
}) {
  return (
    <section id="collections" className="border-t border-neutral-100">
      <div className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader
            title="Collections"
            href="/pieces"
            linkLabel="- View catalogue"
          />
        </div>
        {/* Near full-bleed like demo (~20–25px side inset, tall portrait tiles) */}
        <ul className="grid grid-cols-1 gap-2.5 px-4 sm:px-5 md:grid-cols-3 md:gap-3 lg:px-6">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block min-h-[36rem] overflow-hidden md:min-h-[40rem] lg:min-h-[min(70vh,44rem)]"
              >
                <Image
                  src={collection.heroImage}
                  alt=""
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10 lg:p-12">
                  <h3 className="heading-display text-2xl text-white md:text-3xl lg:text-4xl">
                    {collection.name}
                  </h3>
                  <p className="mt-3 max-w-xs font-display text-base font-light italic text-white/85 md:text-lg">
                    {collection.tagline}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 7 — Featured: 2-col; offset past Arrivals until featured flag exists */
export function HomeFeaturedSection({ products }: { products: ApiProduct[] }) {
  return (
    <HomeProductRow
      title="Featured pieces"
      products={products}
      gridClassName="catalogue-grid grid-cols-1 sm:grid-cols-2"
      imageSizes="(max-width:640px) 100vw, 50vw"
    />
  );
}

/** 8 — Metals / finishes */
export function HomeMetalsSection() {
  return (
    <section className="reveal-on-scroll border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-14 text-center">
          <h2 className="heading-display text-3xl md:text-4xl">
            Precious metals
          </h2>
          <div className="section-hairline mt-8" />
        </div>
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {HOME_METALS.map((metal) => (
            <li key={metal.title} className="text-center">
              <div className="relative mx-auto aspect-[360/490] max-w-sm overflow-hidden bg-neutral-100">
                <Image
                  src={metal.image}
                  alt={metal.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="heading-display mt-6 text-xl md:text-2xl">
                {metal.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
                {metal.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
