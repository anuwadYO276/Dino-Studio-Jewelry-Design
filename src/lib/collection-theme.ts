/**
 * MOCK: per-collection micro-identity until GET /api/public/collections returns theme tokens.
 * Accent ~10–15% — brand shell (Cormorant, white/black) stays shared.
 */

import type { CSSProperties } from "react";

export type LayoutProfile =
  | "botanical-split"
  | "petals-inset"
  | "bloom-cinematic"
  | "gold-tribal-center"
  | "fragments-collage"
  | "relics-heritage"
  | "architecture-structure"
  | "woven-geometry";

export type CollectionMotif =
  | "petal"
  | "fragment"
  | "geometry"
  | "tribal"
  | "relic"
  | "organic"
  | "bloom";

export interface TypeAccent {
  weight: 300 | 400 | 500 | 600;
  italic?: boolean;
  letterSpacing?: string;
}

export interface CollectionTheme {
  accent: string;
  accentMuted: string;
  heroGradient: string;
  editorialOverlay: string;
  layoutProfile: LayoutProfile;
  /** MOCK editorial copy — replace with CMS field */
  moodCopy: string;
  motif: CollectionMotif;
  typeAccent: TypeAccent;
}

const THEMES: Record<string, CollectionTheme> = {
  "botanical-whispers": {
    accent: "#5a6b52",
    accentMuted: "#eef1eb",
    heroGradient:
      "linear-gradient(to top, rgba(18,24,16,0.82) 0%, rgba(90,107,82,0.28) 50%, transparent 100%)",
    editorialOverlay: "rgba(125, 143, 114, 0.1)",
    layoutProfile: "botanical-split",
    moodCopy:
      "Sterling silver shaped like wind-lifted petals — anemone, wild rose, and meadow bloom cast in quiet lines. Hand-finished with sandblasted shimmer; each piece holds a story too soft to speak aloud.",
    motif: "petal",
    typeAccent: { weight: 300, italic: true },
  },
  "fallen-petals": {
    accent: "#9a6b65",
    accentMuted: "#f5ebe9",
    heroGradient:
      "linear-gradient(to top, rgba(45,28,28,0.8) 0%, rgba(184, 144, 138, 0.25) 50%, transparent 100%)",
    editorialOverlay: "rgba(184, 144, 138, 0.15)",
    layoutProfile: "petals-inset",
    moodCopy:
      "Beauty caught at the moment of falling. Romantic, fragile forms preserved in sterling — wearable memento of what fades.",
    motif: "petal",
    typeAccent: { weight: 300, italic: true },
  },
  "wild-bloom": {
    accent: "#6b5a45",
    accentMuted: "#efe9e0",
    heroGradient:
      "linear-gradient(to top, rgba(30,22,15,0.88) 0%, rgba(107, 91, 79, 0.3) 55%, transparent 100%)",
    editorialOverlay: "rgba(139, 115, 85, 0.18)",
    layoutProfile: "bloom-cinematic",
    moodCopy:
      "Untamed lines drawn from nature's raw expression. No symmetry forced — only the honesty of organic growth cast in metal.",
    motif: "bloom",
    typeAccent: { weight: 300, letterSpacing: "0.04em" },
  },
  "primitive-gold": {
    accent: "#a88850",
    accentMuted: "#f3ead8",
    heroGradient:
      "linear-gradient(to top, rgba(25,20,12,0.9) 0%, rgba(196, 165, 116, 0.22) 50%, transparent 100%)",
    editorialOverlay: "rgba(196, 165, 116, 0.14)",
    layoutProfile: "gold-tribal-center",
    moodCopy:
      "Sculpted by tide and stone, refined by the hand. Tribal silhouettes meet artisan luxury — gold warmth against sandblasted silver.",
    motif: "tribal",
    typeAccent: { weight: 500, letterSpacing: "-0.02em" },
  },
  "sacred-fragments": {
    accent: "#6b6560",
    accentMuted: "#ebe9e7",
    heroGradient:
      "linear-gradient(to top, rgba(28,28,30,0.88) 0%, rgba(140, 133, 128, 0.28) 48%, transparent 100%)",
    editorialOverlay: "rgba(140, 133, 128, 0.16)",
    layoutProfile: "fragments-collage",
    moodCopy:
      "Shards of ancient beauty reassembled as adornment. Archaeological forms echoing civilisations past — wearable relics for the contemplative buyer.",
    motif: "fragment",
    typeAccent: { weight: 300, italic: true },
  },
  "golden-relics": {
    accent: "#9a7548",
    accentMuted: "#f5efe6",
    heroGradient:
      "linear-gradient(to top, rgba(35,28,18,0.87) 0%, rgba(184, 149, 107, 0.26) 52%, transparent 100%)",
    editorialOverlay: "rgba(184, 149, 107, 0.14)",
    layoutProfile: "relics-heritage",
    moodCopy:
      "Echoes of time cast in silver and gold. Each piece carries the soft radiance of sandblasted sterling — finished by hand, designed to be collected across generations.",
    motif: "relic",
    typeAccent: { weight: 400, letterSpacing: "0.02em" },
  },
  "organic-architecture": {
    accent: "#4f5f54",
    accentMuted: "#e4e9e5",
    heroGradient:
      "linear-gradient(to top, rgba(18,24,20,0.86) 0%, rgba(110, 127, 114, 0.3) 50%, transparent 100%)",
    editorialOverlay: "rgba(110, 127, 114, 0.13)",
    layoutProfile: "architecture-structure",
    moodCopy:
      "Where branching stems become load-bearing beauty. Nature's engineering translated into wearable structure — geometric calm beneath organic surface.",
    motif: "organic",
    typeAccent: { weight: 400, letterSpacing: "0.02em" },
  },
  "woven-by-nature": {
    accent: "#6b6255",
    accentMuted: "#ece8e2",
    heroGradient:
      "linear-gradient(to top, rgba(32,28,24,0.85) 0%, rgba(154, 143, 126, 0.24) 55%, transparent 100%)",
    editorialOverlay: "rgba(154, 143, 126, 0.15)",
    layoutProfile: "woven-geometry",
    moodCopy:
      "Silent geometry woven through intricate metalwork. Meditative repetition inspired by bark, weave, and root — textural depth in every plane.",
    motif: "geometry",
    typeAccent: { weight: 300, letterSpacing: "0.06em" },
  },
};

const DEFAULT_THEME: CollectionTheme = {
  accent: "#737373",
  accentMuted: "#f5f5f5",
  heroGradient:
    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
  editorialOverlay: "rgba(0,0,0,0.08)",
  layoutProfile: "bloom-cinematic",
  moodCopy: "",
  motif: "organic",
  typeAccent: { weight: 300 },
};

export function getCollectionTheme(slug: string): CollectionTheme {
  return THEMES[slug] ?? DEFAULT_THEME;
}

/** Light text only on dark hero overlays — not on inset/light panels */
export function heroUsesLightText(profile: LayoutProfile): boolean {
  return (
    profile === "botanical-split" ||
    profile === "bloom-cinematic" ||
    profile === "gold-tribal-center" ||
    profile === "relics-heritage"
  );
}

export function collectionTypeStyle(theme: CollectionTheme): CSSProperties {
  return {
    fontWeight: theme.typeAccent.weight,
    fontStyle: theme.typeAccent.italic ? "italic" : "normal",
    letterSpacing: theme.typeAccent.letterSpacing,
  };
}

export interface FeaturedSectionStyle {
  gridClass: string;
  limit: number;
  centered: boolean;
  borderAccent: "none" | "left" | "top";
  sectionLabel: string;
  motifOpacity: number;
}

export function getFeaturedSectionStyle(
  profile: LayoutProfile
): FeaturedSectionStyle {
  switch (profile) {
    case "woven-geometry":
    case "fragments-collage":
      return {
        gridClass: "grid-cols-2 md:grid-cols-3",
        limit: 3,
        centered: false,
        borderAccent: "none",
        sectionLabel: "Selected pieces",
        motifOpacity: 0.28,
      };
    case "gold-tribal-center":
      return {
        gridClass: "grid-cols-2 md:grid-cols-3",
        limit: 3,
        centered: true,
        borderAccent: "top",
        sectionLabel: "Featured pieces",
        motifOpacity: 0.25,
      };
    case "relics-heritage":
      return {
        gridClass: "grid-cols-2 md:grid-cols-3",
        limit: 3,
        centered: true,
        borderAccent: "top",
        sectionLabel: "Selected relics",
        motifOpacity: 0.25,
      };
    case "architecture-structure":
      return {
        gridClass: "grid-cols-2 md:grid-cols-4",
        limit: 4,
        centered: false,
        borderAccent: "left",
        sectionLabel: "Featured pieces",
        motifOpacity: 0.22,
      };
    case "petals-inset":
    case "bloom-cinematic":
      return {
        gridClass: "grid-cols-2 md:grid-cols-4",
        limit: 4,
        centered: false,
        borderAccent: "none",
        sectionLabel: "Featured pieces",
        motifOpacity: 0.24,
      };
    default:
      return {
        gridClass: "grid-cols-2 md:grid-cols-4",
        limit: 4,
        centered: false,
        borderAccent: "none",
        sectionLabel: "Featured pieces",
        motifOpacity: 0.22,
      };
  }
}
