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

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-header-link text-neutral-600 hover:text-neutral-900 ${className ?? ""}`}
          onClick={onNavigate}
        >
          {link.label}
          <span className="nav-header-link__mark" aria-hidden />
        </Link>
      ))}
    </>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        aria-hidden
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <>
      <div className="h-16 shrink-0" aria-hidden />

      <header
        className={`site-header fixed inset-x-0 top-0 ${menuOpen ? "z-[70]" : "z-50"}`}
        data-visible={menuOpen || visible ? "true" : "false"}
        style={{
          backgroundColor: "var(--hero-panel)",
          border: "none",
          backdropFilter: "none",
        }}
      >
        {/* Mobile: hamburger + centered brand */}
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center px-6 lg:hidden">
          <button
            type="button"
            className="mobile-nav-toggle relative z-[80] justify-self-start text-neutral-700"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-overlay"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <MenuIcon open={menuOpen} />
          </button>

          <Link
            href="/"
            className="brand-mark justify-self-center text-center text-neutral-900"
            onClick={closeMenu}
          >
            Dino Studio
          </Link>

          <div aria-hidden className="justify-self-end" />
        </div>

        {/* Desktop: links left + centered brand */}
        <div className="hidden h-16 w-full grid-cols-[1fr_auto_1fr] items-center pl-14 pr-14 lg:grid">
          <nav
            className="nav-label flex items-center justify-start gap-7"
            aria-label="Primary"
          >
            <NavLinks />
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

      {menuOpen && (
        <div
          id="mobile-nav-overlay"
          className="fixed inset-0 z-[60] bg-[var(--hero-panel)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav
            className="nav-label pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-8"
            aria-label="Primary mobile"
          >
            <NavLinks
              className="pointer-events-auto text-base tracking-[0.14em]"
              onNavigate={closeMenu}
            />
          </nav>
        </div>
      )}
    </>
  );
}
