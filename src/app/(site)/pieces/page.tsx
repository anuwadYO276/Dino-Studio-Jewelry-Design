import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "../_components/product-grid";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "The Catalogue",
  "Browse wholesale silver jewelry — filter by type, material, and collection."
);

export default function PiecesPage() {
  return (
    <section className="page-shell">
      <div className="mb-12">
        <p className="section-eyebrow">All Pieces</p>
        <h1 className="heading-display mt-3 text-4xl md:text-5xl">
          The Catalogue
        </h1>
      </div>
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <ProductGrid />
      </Suspense>
    </section>
  );
}
