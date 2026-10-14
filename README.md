# ReKit (`reversed/`)

Inspired rebuild of the public [iusetools.site](https://www.iusetools.site/) product shape.

**Stack:** Next.js 16 + TypeScript + Tailwind 4 (same class of stack as the target: Next/React).  
**Brand:** ReKit (not iUseTools). Own code — see `docs/evidence/RECON.md`.

## Run

```bash
cd /Users/dev/Documents/self/website/reversed
npm install
npm run dev
```

Open http://localhost:3000

## Cloudflare Pages (static export)

```bash
npm run build          # writes ./out
npm run preview        # local check of ./out
```

Cloudflare build settings: command `npx next build`, output directory `out`.

## What was reversed

| Captured | Rebuilt |
| --- | --- |
| Flat routes (`/jpg-to-word`, `/pdf-merge`, …) | Same slugs |
| Categories + 30 tools | All listed + working client UIs |
| Outfit + Inter, dark hero, tool cards, theme toggle | Matched in CSS |
| Privacy / no-upload pitch | Client-side tools |

## Limits (honest)

- PDF text extract: lightweight operator scrape (not full PDF.js text layer)
- PDF → images: page stubs unless you add pdf.js raster later
- OCR: Tesseract.js (English default; extend languages as needed)
- REA CDP against external Chrome failed this session; Cursor browser CDP + HTML fetch used instead
