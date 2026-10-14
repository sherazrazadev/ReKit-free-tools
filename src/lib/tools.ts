export type ToolCategory = "image" | "pdf" | "text" | "utility";

export type ToolDef = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  inputs: string[];
  outputs: string[];
  popular?: boolean;
  accent: string;
};

export const CATEGORIES: Record<
  ToolCategory,
  { label: string; blurb: string }
> = {
  image: {
    label: "Image Tools",
    blurb: "Convert, compress, resize, watermark, and transform image files",
  },
  pdf: {
    label: "PDF Tools",
    blurb: "Work with PDF files — convert, merge, split, and extract",
  },
  text: {
    label: "Text Tools",
    blurb: "Turn text into beautifully formatted documents",
  },
  utility: {
    label: "Utility Tools",
    blurb: "Developer and productivity tools — QR, Base64, JSON, UUID, and more",
  },
};

export const TOOLS: ToolDef[] = [
  {
    slug: "jpg-to-word",
    name: "JPG to Word",
    description:
      "Convert image text into an editable Word document using OCR technology",
    category: "image",
    inputs: ["JPG", "JPEG"],
    outputs: ["DOCX"],
    popular: true,
    accent: "#6366f1",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Merge one or multiple images into a single PDF file",
    category: "image",
    inputs: ["JPG", "JPEG", "PNG"],
    outputs: ["PDF"],
    popular: true,
    accent: "#0ea5e9",
  },
  {
    slug: "image-to-text",
    name: "Image to Text (OCR)",
    description: "Extract text from any image using OCR technology",
    category: "image",
    inputs: ["JPG", "JPEG", "PNG"],
    outputs: ["TXT"],
    accent: "#8b5cf6",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to any dimension without losing quality",
    category: "image",
    inputs: ["JPG", "PNG"],
    outputs: ["PNG", "JPG"],
    accent: "#14b8a6",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress images to reduce file size while preserving quality",
    category: "image",
    inputs: ["JPG", "PNG"],
    outputs: ["JPG", "PNG"],
    accent: "#f59e0b",
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    description: "Convert images between JPG, PNG, WebP, and BMP formats",
    category: "image",
    inputs: ["JPG", "PNG", "WebP"],
    outputs: ["JPG", "PNG", "WebP"],
    accent: "#ef4444",
  },
  {
    slug: "image-watermark",
    name: "Image Watermark",
    description: "Add a custom text or image watermark to your photos",
    category: "image",
    inputs: ["JPG", "PNG"],
    outputs: ["PNG", "JPG"],
    accent: "#ec4899",
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description: "Extract text from any PDF file quickly and accurately",
    category: "pdf",
    inputs: ["PDF"],
    outputs: ["TXT"],
    popular: true,
    accent: "#3b82f6",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert your PDF into an editable Word document",
    category: "pdf",
    inputs: ["PDF"],
    outputs: ["DOCX"],
    popular: true,
    accent: "#2563eb",
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    description: "Convert every PDF page into a JPG or PNG image",
    category: "pdf",
    inputs: ["PDF"],
    outputs: ["JPG", "PNG"],
    accent: "#f97316",
  },
  {
    slug: "pdf-merge",
    name: "PDF Merger",
    description: "Combine multiple PDF files into one single document",
    category: "pdf",
    inputs: ["PDF"],
    outputs: ["PDF"],
    accent: "#3b82f6",
  },
  {
    slug: "pdf-split",
    name: "PDF Splitter",
    description: "Split a PDF into individual pages or custom page ranges",
    category: "pdf",
    inputs: ["PDF"],
    outputs: ["PDF"],
    accent: "#f97316",
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    description: "Convert plain text into a beautifully formatted PDF",
    category: "text",
    inputs: ["TXT", "Plain Text"],
    outputs: ["PDF"],
    accent: "#10b981",
  },
  {
    slug: "text-to-word",
    name: "Text to Word",
    description: "Convert plain text into a formatted Word DOCX file",
    category: "text",
    inputs: ["TXT", "Plain Text"],
    outputs: ["DOCX"],
    accent: "#06b6d4",
  },
  {
    slug: "text-to-image",
    name: "Text to Image",
    description: "Convert text into a downloadable PNG or JPG image",
    category: "text",
    inputs: ["Plain Text"],
    outputs: ["PNG", "JPG"],
    accent: "#a855f7",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and reading time instantly",
    category: "utility",
    inputs: ["Plain Text"],
    outputs: ["Stats"],
    accent: "#64748b",
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between UPPERCASE, lowercase, Title Case, and more",
    category: "utility",
    inputs: ["Plain Text"],
    outputs: ["Text"],
    accent: "#78716c",
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    description: "Encode or decode text and files using Base64 encoding",
    category: "utility",
    inputs: ["Plain Text", "File"],
    outputs: ["Base64", "Text"],
    accent: "#0f766e",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly",
    category: "utility",
    inputs: ["JSON"],
    outputs: ["JSON"],
    accent: "#ca8a04",
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Generate custom QR codes for URLs, text, and more",
    category: "utility",
    inputs: ["Plain Text", "URL"],
    outputs: ["PNG"],
    accent: "#18181b",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure random passwords instantly",
    category: "utility",
    inputs: ["Settings"],
    outputs: ["Password"],
    accent: "#dc2626",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode or decode URLs and query strings with percent-encoding",
    category: "utility",
    inputs: ["Plain Text"],
    outputs: ["URL", "Text"],
    accent: "#0284c7",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographically random UUIDs (v4) in bulk",
    category: "utility",
    inputs: ["Settings"],
    outputs: ["UUID"],
    accent: "#4f46e5",
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder Lorem Ipsum text for your designs",
    category: "utility",
    inputs: ["Settings"],
    outputs: ["Text"],
    accent: "#9333ea",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hash values",
    category: "utility",
    inputs: ["Plain Text"],
    outputs: ["Hash"],
    accent: "#334155",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, RGBA, HSLA, and HSV",
    category: "utility",
    inputs: ["HEX", "Color Picker"],
    outputs: ["HEX", "RGB", "HSL"],
    accent: "#db2777",
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV data to JSON format instantly",
    category: "utility",
    inputs: ["CSV"],
    outputs: ["JSON"],
    accent: "#059669",
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Write Markdown and preview the rendered HTML output live",
    category: "utility",
    inputs: ["Markdown"],
    outputs: ["HTML"],
    accent: "#1d4ed8",
  },
  {
    slug: "text-diff",
    name: "Text Diff Tool",
    description: "Compare two texts and highlight added and removed lines",
    category: "utility",
    inputs: ["Plain Text"],
    outputs: ["Diff"],
    accent: "#b45309",
  },
  {
    slug: "base-converter",
    name: "Number Base Converter",
    description:
      "Convert numbers between Binary, Octal, Decimal, and Hexadecimal",
    category: "utility",
    inputs: ["Number"],
    outputs: ["Binary", "Hex", "Decimal"],
    accent: "#475569",
  },
];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory) {
  return TOOLS.filter((t) => t.category === category);
}

export const BRAND = {
  name: "ReKit",
  tagline: "Convert Anything. Instantly. For Free.",
  description:
    "30+ powerful browser-based tools — PDF, images, text conversion, and developer utilities with zero uploads. Your files stay on your device, always.",
};