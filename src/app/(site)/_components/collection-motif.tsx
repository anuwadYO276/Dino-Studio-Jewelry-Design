import type { CollectionMotif } from "@/lib/collection-theme";

interface Props {
  motif: CollectionMotif;
  color: string;
  className?: string;
  opacity?: number;
}

/** Decorative SVG layer — MOCK until editorial art direction assets arrive */
export function CollectionMotif({
  motif,
  color,
  className = "",
  opacity = 0.14,
}: Props) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke={color}
      strokeWidth="0.75"
      opacity={opacity}
    >
      {motif === "petal" && (
        <>
          <path d="M80 280 Q120 180 200 120 Q280 180 320 280 Q200 320 80 280" />
          <path d="M120 300 Q200 220 280 300" opacity={0.6} />
        </>
      )}
      {motif === "fragment" && (
        <>
          <path d="M40 80 L120 40 L160 120 L80 160 Z" />
          <path d="M260 60 L340 100 L300 180 L220 140 Z" />
          <path d="M180 240 L260 200 L300 300 L200 340 Z" />
          <path d="M60 260 L100 200 L140 280 Z" opacity={0.6} />
        </>
      )}
      {motif === "geometry" && (
        <>
          <circle cx="200" cy="200" r="80" />
          <circle cx="200" cy="200" r="120" opacity={0.5} />
          <line x1="80" y1="200" x2="320" y2="200" />
          <line x1="200" y1="80" x2="200" y2="320" />
          <line x1="115" y1="115" x2="285" y2="285" opacity={0.5} />
          <line x1="285" y1="115" x2="115" y2="285" opacity={0.5} />
        </>
      )}
      {motif === "tribal" && (
        <>
          <path d="M200 60 L240 140 L320 140 L260 200 L280 280 L200 240 L120 280 L140 200 L80 140 L160 140 Z" />
          <path d="M200 100 L200 220" opacity={0.6} />
          <path d="M160 180 L240 180" opacity={0.6} />
        </>
      )}
      {motif === "relic" && (
        <>
          <path d="M160 320 L160 120 Q200 60 240 120 L240 320" />
          <path d="M140 320 L260 320" />
          <path d="M180 160 L220 160 M180 200 L220 200 M180 240 L220 240" opacity={0.6} />
        </>
      )}
      {motif === "organic" && (
        <>
          <path d="M200 340 L200 200 Q160 160 120 120 Q200 140 200 80 Q200 140 280 120 Q240 160 200 200" />
          <path d="M200 200 Q120 180 60 140" opacity={0.5} />
          <path d="M200 200 Q280 180 340 140" opacity={0.5} />
        </>
      )}
      {motif === "bloom" && (
        <>
          <path d="M200 120 Q240 160 200 200 Q160 160 200 120" />
          <path d="M200 120 Q280 140 280 200 Q280 260 200 280 Q120 260 120 200 Q120 140 200 120" opacity={0.5} />
          <circle cx="200" cy="200" r="12" fill={color} stroke="none" opacity={0.3} />
        </>
      )}
    </svg>
  );
}
