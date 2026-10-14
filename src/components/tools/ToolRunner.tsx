"use client";

import type { ToolDef } from "@/lib/tools";
import {
  Base64Tool,
  BaseConverter,
  CaseConverter,
  ColorConverter,
  CsvToJson,
  HashGenerator,
  JsonFormatter,
  LoremIpsum,
  MarkdownPreview,
  PasswordGenerator,
  QrGenerator,
  TextDiffTool,
  UrlEncoder,
  UuidGenerator,
  WordCounter,
} from "./UtilityTools";
import {
  ImageCompressor,
  ImageConverter,
  ImageResizer,
  ImageToPdf,
  ImageToText,
  ImageWatermark,
  JpgToWord,
  PdfMerge,
  PdfSplit,
  PdfToImages,
  PdfToText,
  PdfToWord,
  TextToImage,
  TextToPdf,
  TextToWord,
} from "./FileTools";

const MAP: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
  "case-converter": CaseConverter,
  base64: Base64Tool,
  "json-formatter": JsonFormatter,
  "qr-generator": QrGenerator,
  "password-generator": PasswordGenerator,
  "url-encoder": UrlEncoder,
  "uuid-generator": UuidGenerator,
  "lorem-ipsum": LoremIpsum,
  "hash-generator": HashGenerator,
  "color-converter": ColorConverter,
  "csv-to-json": CsvToJson,
  "markdown-preview": MarkdownPreview,
  "text-diff": TextDiffTool,
  "base-converter": BaseConverter,
  "jpg-to-word": JpgToWord,
  "image-to-text": ImageToText,
  "image-to-pdf": ImageToPdf,
  "image-resizer": ImageResizer,
  "image-compressor": ImageCompressor,
  "image-converter": ImageConverter,
  "image-watermark": ImageWatermark,
  "pdf-to-text": PdfToText,
  "pdf-to-word": PdfToWord,
  "pdf-to-images": PdfToImages,
  "pdf-merge": PdfMerge,
  "pdf-split": PdfSplit,
  "text-to-pdf": TextToPdf,
  "text-to-word": TextToWord,
  "text-to-image": TextToImage,
};

export function ToolRunner({ tool }: { tool: ToolDef }) {
  const Comp = MAP[tool.slug];
  if (!Comp) return <p>Tool not implemented.</p>;
  return <Comp />;
}
