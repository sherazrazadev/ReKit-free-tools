"use client";

import { canvasToBlob, loadImage } from "@/lib/download";

export async function imageFileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0);
  return canvas;
}

/** Normalize any browser-decodable image to PNG/JPEG bytes for pdf-lib. */
export async function imageFileToEmbeddable(
  file: File,
  prefer: "png" | "jpeg" = "jpeg",
): Promise<{ bytes: Uint8Array; kind: "png" | "jpeg"; width: number; height: number }> {
  const canvas = await imageFileToCanvas(file);
  const mime = prefer === "png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(canvas, mime, prefer === "jpeg" ? 0.92 : undefined);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return { bytes, kind: prefer, width: canvas.width, height: canvas.height };
}

/** Uncompressed 24-bit BMP from canvas ImageData. */
export function canvasToBmpBlob(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelSize = rowSize * height;
  const fileSize = 54 + pixelSize;
  const buf = new ArrayBuffer(fileSize);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  u8[0] = 0x42;
  u8[1] = 0x4d;
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, -height, true); // top-down
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelSize, true);

  let offset = 54;
  const data = image.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      u8[offset++] = data[i + 2]!; // B
      u8[offset++] = data[i + 1]!; // G
      u8[offset++] = data[i]!; // R
    }
    offset += rowSize - width * 3;
  }

  return new Blob([buf], { type: "image/bmp" });
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (!para) {
      lines.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export const OCR_LANGS = [
  { id: "eng", label: "English" },
  { id: "chi_sim", label: "Chinese (Simplified)" },
  { id: "chi_tra", label: "Chinese (Traditional)" },
  { id: "jpn", label: "Japanese" },
  { id: "kor", label: "Korean" },
  { id: "ara", label: "Arabic" },
  { id: "fra", label: "French" },
  { id: "deu", label: "German" },
  { id: "spa", label: "Spanish" },
  { id: "vie", label: "Vietnamese" },
  { id: "tha", label: "Thai" },
  { id: "hin", label: "Hindi" },
  { id: "rus", label: "Russian" },
  { id: "por", label: "Portuguese" },
  { id: "ita", label: "Italian" },
] as const;

export async function ocrImage(
  file: File,
  lang: string,
  onProgress?: (pct: number | null, status: string) => void,
): Promise<string> {
  const Tesseract = await import("tesseract.js");
  const result = await Tesseract.recognize(file, lang, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress?.(Math.round(m.progress * 100), "Recognizing text…");
      } else if (m.status) {
        onProgress?.(null, String(m.status));
      }
    },
  });
  return result.data.text;
}
