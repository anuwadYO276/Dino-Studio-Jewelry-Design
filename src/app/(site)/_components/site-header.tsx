"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;
  const light = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-neutral-100 bg-white/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className={`brand-mark transition-colors ${
            light ? "text-white" : "text-neutral-900"
          }`}
        >
          Dino Studio
        </Link>
        <nav
          className={`nav-label flex items-center gap-4 sm:gap-8 ${
            light ? "text-white/80" : "text-neutral-500"
          }`}
        >
          <Link
            href="/#collections"
            className={`hidden transition-colors sm:inline ${
              light ? "hover:text-white" : "hover:text-neutral-900"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/pieces"
            className={light ? "hover:text-white" : "hover:text-neutral-900"}
          >
            Pieces
          </Link>
          <Link
            href="/inquiry"
            className={
              light
                ? "border border-white/90 px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-white transition-colors hover:bg-white hover:text-neutral-900 sm:px-4 sm:py-2"
                : "btn-nav"
            }
          >
            Inquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}
