import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Dino Studio | Artisan Silver Jewelry",
  description:
    "Wholesale artisan silver jewelry for international buyers. Nature, memory, imperfection, soul.",
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${cormorant.variable} min-h-screen bg-white text-neutral-900`}
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/showcase"
            className="font-[family-name:var(--font-display)] text-lg font-light tracking-[0.25em] uppercase text-neutral-900 sm:text-xl"
          >
            Dino studio
          </Link>
          <nav className="flex items-center gap-4 text-[10px] tracking-[0.12em] uppercase text-neutral-500 sm:gap-8 sm:text-xs sm:tracking-[0.15em]">
            <Link
              href="/showcase#collections"
              className="hidden transition-colors hover:text-neutral-900 sm:inline"
            >
              Collections
            </Link>
            <Link
              href="/showcase#pieces"
              className="transition-colors hover:text-neutral-900"
            >
              Pieces
            </Link>
            <Link
              href="/showcase#inquiry"
              className="border border-neutral-900 px-3 py-1.5 text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white sm:px-4 sm:py-2"
            >
              Inquiry
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="font-[family-name:var(--font-display)] text-2xl font-light tracking-[0.2em] uppercase">
                Dino studio
              </p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                {BRAND_FOOTER_TAGLINE}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
                Collections
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {/* API: map from GET /api/public/collections */}
                {FOOTER_COLLECTIONS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div id="inquiry">
              <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
                Wholesale
              </p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                For international buyers — Europe, Australia, USA, Asia &amp;
                beyond.
              </p>
              {/* API: wire to inquiry form / POST /api/inquiries */}
              <a
                href="mailto:wholesale@dinostudio.com"
                className="mt-6 inline-block text-sm tracking-wide text-neutral-900 underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                wholesale@dinostudio.com
              </a>
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

// API: GET /api/public/brand → keywords
const BRAND_FOOTER_TAGLINE =
  "Refined simplicity, timeless elegance — quiet luxury in sterling silver.";

// API: GET /api/public/collections → name only
const FOOTER_COLLECTIONS = [
  "Botanical Whispers",
  "Fallen Petals",
  "Wild Bloom",
  "Primitive Gold",
  "Sacred Fragments",
];
