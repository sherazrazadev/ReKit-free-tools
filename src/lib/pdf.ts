"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

let workerReady = false;

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerReady) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    workerReady = true;
  }
  return pdfjs;
}

export async function openPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs();
  return pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
}

/** Extract readable text via PDF.js text layer (not raw Tj scrape). */
export async function extractPdfText(
  data: ArrayBuffer,
  onProgress?: (page: number, total: number) => void,
): Promise<{ text: string; pages: number; title: string }> {
  const pdf = await openPdf(data);
  const meta = await pdf.getMetadata().catch(() => null);
  const info = (meta?.info ?? {}) as { Title?: string };
  const parts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY: number | null = null;

    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = Array.isArray(item.transform) ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(lastY - y) > 6) {
        parts.push(line.trimEnd());
        line = "";
      }
      line += item.str + (item.hasEOL ? "\n" : "");
      if (!item.hasEOL && item.str && !item.str.endsWith(" ")) line += " ";
      lastY = y;
    }
    if (line.trim()) parts.push(line.trimEnd());
    if (i < pdf.numPages) parts.push("");
  }

  const text = parts.join("\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return {
    text,
    pages: pdf.numPages,
    title: info.Title?.trim() || "",
  };
}

export async function renderPdfPages(
  data: ArrayBuffer,
  format: "image/png" | "image/jpeg",
  scale = 2,
  onProgress?: (page: number, total: number) => void,
): Promise<Blob[]> {
  const pdf = await openPdf(data);
  const blobs: Blob[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(i, pdf.numPages);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        format,
        format === "image/jpeg" ? 0.92 : undefined,
      );
    });
    blobs.push(blob);
  }

  return blobs;
}
