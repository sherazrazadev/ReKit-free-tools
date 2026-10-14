# Recon notes — iusetools.site

Captured 2026-10-14 via Cursor browser CDP + public HTML fetch.

## Stack (evidence)

- Next.js App Router (`/_next/static/chunks/`, turbopack chunk names)
- React
- Fonts: **Outfit** (display/headings), **Inter** (body)
- Body: `rgb(255,255,255)` bg, `rgb(15,23,41)` text
- H1 (hero): Outfit 800, white, ~36px mobile
- Ads: Google AdSense client `ca-pub-7280243300261707` (we will NOT copy)

## Routes (flat slugs)

Image: `/jpg-to-word` `/image-to-text` `/image-to-pdf` `/image-resizer` `/image-compressor` `/image-converter` `/image-watermark`  
PDF: `/pdf-to-text` `/pdf-to-word` `/pdf-to-images` `/pdf-merge` `/pdf-split`  
Text: `/text-to-pdf` `/text-to-word` `/text-to-image`  
Utility: `/word-counter` `/case-converter` `/base64` `/json-formatter` `/qr-generator` `/password-generator` `/url-encoder` `/uuid-generator` `/lorem-ipsum` `/hash-generator` `/color-converter` `/csv-to-json` `/markdown-preview` `/text-diff` `/base-converter`  
Meta: `/` `/tools` `/about` `/blog` `/faq` `/help` `/contact` + legal pages

## REA CDP note

External Chrome `--remote-debugging-port=9222` became unreachable to `rea list-browser-targets` in this session. Structure/design evidence taken via Cursor browser CDP instead. Rebuild uses own code under brand **ReKit**.
