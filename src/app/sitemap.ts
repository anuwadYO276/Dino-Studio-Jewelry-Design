import type { MetadataRoute } from "next";
import { COLLECTIONS } from "@/lib/mock-catalogue-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pieces`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/inquiry`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const collections: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...collections];
}
