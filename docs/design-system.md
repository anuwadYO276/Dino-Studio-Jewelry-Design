# Dino Studio — Design system

Extracted from grill session against `doc/index.html` (Astra/Elementor jewellery demo).  
**Do not clone** the demo’s warm gold (`#db9662`) or retail cart UX. Map structure + rhythm into Dino’s silver / wholesale catalogue.

## Tokens

| Token | Value | Use |
|-------|--------|-----|
| `--background` | `#ffffff` | Page shell |
| `--foreground` | `#171717` | Body ink |
| `--brand-accent` | `#8a8f96` | Sterling silver gray — dividers, underline CTAs, metals accents (~10–15%) |
| `--brand-accent-muted` | `rgba(138, 143, 150, 0.12)` | Soft surfaces |
| Display font | Cormorant Garamond | Brand, headings |
| Body font | Helvetica Neue / system | UI, body |

Per-collection accents (`collection-theme.ts`) stay on collection pages / collection hero only — not the global shell.

## CTA

| Context | Pattern |
|---------|---------|
| Hero | Existing `btn-catalogue` (Browse catalogue + Trade inquiry) |
| Section secondary | `.text-link-editorial` — `- View all` style underline |

## Product cards (home)

- Image + name + category/collection + price (`showPrice`)
- No Add-to-cart / Quick View overlays
- Hover: light opacity / “Discover →” only

## Homepage sections (order)

1. **Hero** — true 50/50 like demo: left column full-viewport-height paper; right shows fixed bg image. Typography like demo: Cormorant semibold H1 “Dino Studio”, italic subhead, outline CTA `- Browse catalogue` (+ underline `- Trade inquiry`). Mobile: single column, bg scrolls.  
2. **Category** — 3 image tiles (Ring, Earring, Necklace) + `- View all types`  
3. **Story** — existing split (image + copy); tune spacing only  
4. **Arrivals** — newest products, 3-column grid  
5. **Testimonials** — mock B2B quotes until real reviews  
6. **Collection tiles ×3** — near full-bleed, tall portrait cards (`min-h` ~36–44rem / up to 70vh); home only; no “Starting at $”  
7. **Featured** — curated set, 2-column grid (until API `featured` flag: newest list offset past Arrivals)  
8. **Metals** — Sterling Silver · Sandblasted texture · Hand-finished / atelier craft  

### Explicitly out of scope

- Promo / % discount strips  
- Split editorial footer banner from the demo  
- Replacing collection-page editorial layouts (`collection-sections.tsx` / `collection-theme` stay for `/collections/[slug]`)

## Reference

- Source mood: Photo-Based + Editorial + Minimalist (`doc/index.html`)  
- Brand story / mock content: `src/lib/mock-catalogue-data.ts`  
- CSS: `src/app/globals.css`  
- **Navbar contrast:** solid `--hero-panel` bar (not translucent). Dark text on paper. Matches left hero column so the bar does not cut across the photo.
