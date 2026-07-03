"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SCROLL_BLEND = 120;
const HIDE_AFTER = 80;
const DIRECTION_THRESHOLD = 8;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(isHome ? 0 : 1);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    if (!isHome) {
      setProgress(1);
      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < HIDE_AFTER) setVisible(true);
        else if (delta > DIRECTION_THRESHOLD) setVisible(false);
        else if (delta < -DIRECTION_THRESHOLD) setVisible(true);

        lastY.current = y;
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setProgress(Math.min(y / SCROLL_BLEND, 1));

      if (y < HIDE_AFTER) setVisible(true);
      else if (delta > DIRECTION_THRESHOLD) setVisible(false);
      else if (delta < -DIRECTION_THRESHOLD) setVisible(true);

      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const light = isHome && progress < 0.4;

  return (
    <>
      <div className="h-16 shrink-0" aria-hidden />

      <header
        className="site-header fixed inset-x-0 top-0 z-50"
        data-visible={visible ? "true" : "false"}
        style={
          isHome
            ? {
                backgroundColor: visible
                  ? `rgba(255,255,255,${progress * 0.92})`
                  : "rgba(255,255,255,0.95)",
                backdropFilter: visible
                  ? `blur(${progress * 8}px)`
                  : "blur(8px)",
                borderBottomColor: visible
                  ? `rgba(245,245,245,${progress})`
                  : "rgb(245,245,245)",
                boxShadow:
                  !visible || progress > 0.6
                    ? "0 1px 0 rgba(0,0,0,0.04)"
                    : "none",
              }
            : {
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderBottomColor: "rgb(245,245,245)",
                boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
              }
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className={`brand-mark transition-colors duration-300 ${
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
              className={`nav-header-link hidden sm:inline ${
                light ? "hover:text-white" : "hover:text-neutral-900"
              }`}
            >
              Collections
              <span className="nav-header-link__mark" aria-hidden />
            </Link>
            <Link
              href="/pieces"
              className={`nav-header-link ${
                light ? "hover:text-white" : "hover:text-neutral-900"
              }`}
            >
              Pieces
              <span className="nav-header-link__mark" aria-hidden />
            </Link>
            <Link
              href="/inquiry"
              className={
                light
                  ? "border border-white/90 px-3 py-1.5 text-[11px] tracking-[0.12em] uppercase text-white transition-colors duration-300 hover:bg-white hover:text-neutral-900 sm:min-h-11 sm:px-4 sm:py-2"
                  : "btn-nav sm:min-h-11"
              }
              style={
                isHome && light
                  ? { borderColor: `rgba(255,255,255,${0.9 - progress * 0.5})` }
                  : undefined
              }
            >
              Inquiry
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
