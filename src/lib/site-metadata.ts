import type { Metadata } from "next";

export const SITE_NAME = "Dino studio";
export const SITE_DESCRIPTION =
  "Wholesale artisan silver jewelry for international buyers. Nature, memory, imperfection, soul.";
export const SITE_KEYWORDS = [
  "artisan silver jewelry",
  "wholesale jewelry",
  "sterling silver",
  "quiet luxury",
  "handcrafted jewelry",
  "European buyers",
];

export function pageMetadata(
  title: string,
  description: string = SITE_DESCRIPTION
): Metadata {
  const fullTitle =
    title === "Home"
      ? `${SITE_NAME} | Artisan Silver Jewelry`
      : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: SITE_KEYWORDS,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
