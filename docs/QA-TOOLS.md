# ReKit tools QA

Updated: 2026-10-14 (after PDF.js + partial-tool fixes)

Method: implementation review + `npm run build` + PDF.js extract smoke test on a generated text PDF.

## Summary

| Status | Count |
| --- | ---: |
| Working | 30 |
| Partial | 0 |
| Broken / stub | 0 |

## Fixed in this pass

### Was broken (3)

| Tool | Fix |
| --- | --- |
| PDF to Text | PDF.js text layer (`extractPdfText`) + progress |
| PDF to Word | Same extract → DOCX |
| PDF to Images | PDF.js page render → real PNG/JPG ZIP |

### Was partial (8)

| Tool | Fix |
| --- | --- |
| JPG to Word | OCR language select (15 langs) + progress |
| Image to Text | Same OCR language + progress |
| Image to PDF | Any browser-decodable image → canvas → JPEG embed |
| Image Converter | BMP encode/decode path added |
| Image Watermark | Text or image watermark, opacity, 5 positions |
| Image Compressor | JPEG / WebP / PNG output + quality |
| Text to Image | Word wrap, dynamic height, width + PNG/JPG |
| Base64 | Text + file encode/decode download |

## UX

- Busy state on file drops (“Working…”)
- Progress bars for OCR / PDF page work
- Status tones: ok / error / muted
- Clearer hints on what formats are supported

## Residual limits (honest, not “broken”)

- OCR quality still depends on image clarity; first run downloads language data for Tesseract.
- Scanned PDFs with **no** text layer still need PDF → Images → OCR.
- PDF.js worker loads from `unpkg.com` (needs network first time in the browser).
- Complex CSV quoting still basic in CSV → JSON.
