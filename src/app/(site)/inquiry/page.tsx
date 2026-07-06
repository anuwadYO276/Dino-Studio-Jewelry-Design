import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { InquiryForm } from "../_components/inquiry-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = pageMetadata(
  "Wholesale inquiry",
  "Request a wholesale quote from Dino studio — international buyers welcome."
);

export default function InquiryPage() {
  return (
    <>
      <section className="page-shell-narrow">
        <Link
          href="/"
          className="section-eyebrow-sm transition-colors hover:text-neutral-900"
        >
          ← Home
        </Link>
        <p className="section-eyebrow mt-8">Wholesale</p>
        <h1 className="heading-display mt-3 text-4xl">
          Send an inquiry
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
          For international buyers — Europe, Australia, USA, Asia and beyond.
          We respond within 24 hours.
        </p>
        <div className="mt-10 border-t border-neutral-100 pt-10">
          <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
            <InquiryForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
