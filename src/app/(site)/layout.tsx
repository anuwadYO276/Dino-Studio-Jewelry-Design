import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteHeader } from "./_components/site-header";
import { COLLECTIONS } from "@/lib/mock-catalogue-data";
import { getCollectionTheme } from "@/lib/collection-theme";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "Home",
  "Artisan silver jewelry wholesale — refined simplicity, timeless elegance. Nature, memory, imperfection, soul."
);

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      <main>{children}</main>

      <footer className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="brand-mark text-2xl">Dino Studio</p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                {BRAND_FOOTER_TAGLINE}
              </p>
            </div>
            <div>
              <p className="section-eyebrow-sm">Collections</p>
              <ul className="mt-4 space-y-2.5">
                {COLLECTIONS.map((c) => {
                  const theme = getCollectionTheme(c.slug);
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        className="footer-collection-link"
                        style={
                          {
                            "--collection-accent": theme.accent,
                          } as CSSProperties
                        }
                      >
                        <span
                          className="footer-collection-link__mark"
                          aria-hidden
                        />
                        <span className="footer-collection-link__text">
                          {c.name}
                        </span>
                        <span
                          className="footer-collection-link__arrow"
                          aria-hidden
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="section-eyebrow-sm">Wholesale</p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                For international buyers — Europe, Australia, USA, Asia &amp;
                beyond.
              </p>
              <a
                href="mailto:silversand-bkk@hotmail.com"
                className="mt-4 inline-block text-sm tracking-wide text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                silversand-bkk@hotmail.com
              </a>
              <Link
                href="/inquiry"
                className="mt-3 block text-sm tracking-wide text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                Request a wholesale quote →
              </Link>
            </div>
          </div>

          <p className="mt-16 text-center text-xs text-neutral-400">
            © {new Date().getFullYear()} Dino Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const BRAND_FOOTER_TAGLINE =
  "Refined simplicity, timeless elegance — quiet luxury in sterling silver.";
