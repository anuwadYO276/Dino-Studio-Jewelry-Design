"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HIDE_AFTER = 80;
const DIRECTION_THRESHOLD = 8;

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pieces", label: "Pieces" },
  { href: "/#collections", label: "Collections" },
  { href: "/inquiry", label: "Inquiry" },
] as const;

export function SiteHeader() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < HIDE_AFTER) setVisible(true);
      else if (delta > DIRECTION_THRESHOLD) setVisible(false);
      else if (delta < -DIRECTION_THRESHOLD) setVisible(true);

      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h-16 shrink-0" aria-hidden />

      <header
        className="site-header fixed inset-x-0 top-0 z-50"
        data-visible={visible ? "true" : "false"}
        style={{
          backgroundColor: "var(--hero-panel)",
          border: "none",
          backdropFilter: "none",
        }}
      >
        {/* Full-bleed: links hug left edge; brand stays viewport-center */}
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center pl-6 pr-6 sm:pl-6 sm:pr-6 lg:pl-14 lg:pr-14">
          <nav
            className="nav-label flex flex-wrap items-center justify-start gap-3 sm:gap-7"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-header-link text-neutral-600 hover:text-neutral-900"
              >
                {link.label}
                <span className="nav-header-link__mark" aria-hidden />
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="brand-mark justify-self-center text-center text-neutral-900"
          >
            Dino Studio
          </Link>

          <div aria-hidden className="justify-self-end" />
        </div>
      </header>
    </>
  );
}
