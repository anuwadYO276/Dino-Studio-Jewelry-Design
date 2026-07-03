import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CollectionEditorialSection,
  CollectionFeaturedSection,
  CollectionHeroSection,
  CollectionInquiryStrip,
} from "../../_components/collection-sections";
import { getCollectionTheme } from "@/lib/collection-theme";
import { COLLECTIONS, getCollection } from "@/lib/mock-catalogue-data";
import { pageMetadata } from "@/lib/site-metadata";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return pageMetadata("Collection");
  return pageMetadata(collection.name, collection.tagline);
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  // MOCK: no GET /api/public/collections/:slug
  const collection = getCollection(slug);
  if (!collection) notFound();

  const theme = getCollectionTheme(slug);

  return (
    <div
      style={
        {
          "--collection-accent": theme.accent,
          "--collection-accent-muted": theme.accentMuted,
        } as CSSProperties
      }
    >
      <CollectionHeroSection collection={collection} slug={slug} theme={theme} />
      <CollectionEditorialSection collection={collection} theme={theme} />
      <CollectionFeaturedSection
        slug={slug}
        collectionName={collection.name}
        theme={theme}
      />
      <CollectionInquiryStrip slug={slug} collectionName={collection.name} theme={theme} />
    </div>
  );
}
