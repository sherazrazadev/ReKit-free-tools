# Target: public product map (inspiration)

Source (marketing / UI only): https://www.iusetools.site/  
Captured from public homepage copy. Reimplement ourselves; do not copy their code or brand.

## Product promise

- 30+ free online tools
- Browser-based, no signup
- Files stay on device (client-side / WASM-style processing)
- Categories: Image, PDF, Text, Utility (+ Blog, FAQ, About)

## Homepage sections (UX)

1. Nav: Home, category dropdowns, Blog, FAQ, About, All Tools  
2. Hero: headline + CTA (Explore All Tools / try one popular tool)  
3. Stats strip: tool count / languages / private  
4. Tool grid by category  
5. How it works (3 steps: open → upload/paste → convert & download)  
6. Why us (private, instant, languages, free)  
7. FAQ  
8. Blog teaser  
9. Footer CTAs + legal links  

## Tool inventory (public)

### Image (7)

- JPG to Word (OCR → DOCX)  
- Image to Text (OCR)  
- Image to PDF  
- Image Resizer  
- Image Compressor  
- Image Converter (JPG/PNG/WebP/BMP)  
- Image Watermark  

### PDF (5)

- PDF to Text  
- PDF to Word  
- PDF to Images  
- PDF Merger  
- PDF Splitter  

### Text (3)

- Text to PDF  
- Text to Word  
- Text to Image  

### Utility (15)

- Word Counter  
- Case Converter  
- QR Code Generator  
- Password Generator  
- JSON Formatter  
- Base64 Encoder/Decoder  
- URL Encoder/Decoder  
- Hash Generator  
- UUID Generator  
- Lorem Ipsum  
- Color Converter  
- CSV to JSON  
- Markdown Preview  
- Text Diff  
- Base Converter  

## Stated limits (their FAQ)

- PDF up to ~50MB, images up to ~20MB  
- Inputs: PDF, JPG/JPEG, PNG, WebP, BMP, TXT, CSV, JSON, Markdown  
- Outputs: DOCX, PDF, TXT, PNG, JPG, JSON  

## Our build rules

- Own brand name (not iUseTools)  
- Own UI and implementation in `/reversed`  
- Prefer client-side processing where practical  
- Use REA only for structure/behavior evidence, then write new code  
