"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import JSZip from "jszip";
import { Button, FileDrop, Input, Label, Panel, Status, TextArea } from "@/components/ui";
import { canvasToBlob, downloadBlob, downloadText, loadImage } from "@/lib/download";

async function ocrImage(file: File): Promise<string> {
  const Tesseract = await import("tesseract.js");
  const { data } = await Tesseract.recognize(file, "eng");
  return data.text;
}

export function JpgToWord() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="image/*"
        label="Drop an image for OCR → Word"
        onFiles={async ([file]) => {
          if (!file) return;
          setStatus("Running OCR in your browser…");
          try {
            const text = await ocrImage(file);
            const doc = new Document({
              sections: [{ children: text.split(/\n+/).map((line) => new Paragraph({ children: [new TextRun(line)] })) }],
            });
            const blob = await Packer.toBlob(doc);
            downloadBlob(blob, "ocr.docx");
            setStatus("Downloaded ocr.docx");
          } catch (e) {
            setStatus(e instanceof Error ? e.message : "OCR failed");
          }
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageToText() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="image/*"
        onFiles={async ([file]) => {
          if (!file) return;
          setStatus("OCR running…");
          try {
            setText(await ocrImage(file));
            setStatus("Done — text stays on your device");
          } catch (e) {
            setStatus(e instanceof Error ? e.message : "OCR failed");
          }
        }}
      />
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => downloadText(text, "ocr.txt")} disabled={!text}>
        Download TXT
      </Button>
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageToPdf() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="image/*"
        multiple
        label="Drop one or more images → PDF"
        onFiles={async (files) => {
          if (!files.length) return;
          setStatus("Building PDF…");
          const pdf = await PDFDocument.create();
          for (const file of files) {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const img = file.type.includes("png")
              ? await pdf.embedPng(bytes)
              : await pdf.embedJpg(bytes);
            const page = pdf.addPage([img.width, img.height]);
            page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
          }
          const out = await pdf.save();
          downloadBlob(
            new Blob([Uint8Array.from(out)], { type: "application/pdf" }),
            "images.pdf",
          );
          setStatus(`Merged ${files.length} image(s)`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageResizer() {
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [keep, setKeep] = useState(true);
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width</Label>
          <Input type="number" value={w} onChange={(e) => setW(+e.target.value)} />
        </div>
        <div>
          <Label>Height</Label>
          <Input type="number" value={h} onChange={(e) => setH(+e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
        Keep aspect ratio (height ignored)
      </label>
      <FileDrop
        accept="image/*"
        onFiles={async ([file]) => {
          if (!file) return;
          const img = await loadImage(file);
          const tw = w;
          const th = keep ? Math.round((img.height / img.width) * tw) : h;
          const canvas = document.createElement("canvas");
          canvas.width = tw;
          canvas.height = th;
          canvas.getContext("2d")!.drawImage(img, 0, 0, tw, th);
          const blob = await canvasToBlob(canvas, "image/png");
          downloadBlob(blob, `resized-${tw}x${th}.png`);
          setStatus(`Saved ${tw}×${th}`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(0.7);
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <Label>JPEG quality: {quality.toFixed(2)}</Label>
      <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full" />
      <FileDrop
        accept="image/*"
        onFiles={async ([file]) => {
          if (!file) return;
          const img = await loadImage(file);
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d")!.drawImage(img, 0, 0);
          const blob = await canvasToBlob(canvas, "image/jpeg", quality);
          downloadBlob(blob, "compressed.jpg");
          setStatus(`Original ~${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageConverter() {
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {([
          ["PNG", "image/png"],
          ["JPG", "image/jpeg"],
          ["WebP", "image/webp"],
        ] as const).map(([label, mime]) => (
          <Button key={mime} variant={format === mime ? "primary" : "ghost"} onClick={() => setFormat(mime)}>
            {label}
          </Button>
        ))}
      </div>
      <FileDrop
        accept="image/*"
        onFiles={async ([file]) => {
          if (!file) return;
          const img = await loadImage(file);
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d")!.drawImage(img, 0, 0);
          const blob = await canvasToBlob(canvas, format, 0.92);
          const ext = format.split("/")[1].replace("jpeg", "jpg");
          downloadBlob(blob, `converted.${ext}`);
          setStatus(`Converted to ${ext.toUpperCase()}`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function ImageWatermark() {
  const [mark, setMark] = useState("ReKit");
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <Label>Watermark text</Label>
      <Input value={mark} onChange={(e) => setMark(e.target.value)} />
      <FileDrop
        accept="image/*"
        onFiles={async ([file]) => {
          if (!file) return;
          const img = await loadImage(file);
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.strokeStyle = "rgba(0,0,0,0.35)";
          ctx.font = `bold ${Math.max(24, Math.floor(img.width / 18))}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(mark, img.width / 2, img.height / 2);
          ctx.strokeText(mark, img.width / 2, img.height / 2);
          const blob = await canvasToBlob(canvas, "image/png");
          downloadBlob(blob, "watermarked.png");
          setStatus("Downloaded watermarked.png");
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function PdfToText() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="application/pdf"
        onFiles={async ([file]) => {
          if (!file) return;
          setStatus("Extracting text with pdf-lib metadata + raw scan…");
          try {
            const bytes = await file.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const title = pdf.getTitle() ?? "";
            // pdf-lib does not extract content streams; use a lightweight text pull from raw
            const raw = new TextDecoder("latin1").decode(bytes);
            const chunks = [...raw.matchAll(/\(([^)]{2,200})\)\s*Tj/g)].map((m) => m[1]);
            const extracted = chunks.join(" ").replace(/\\n/g, "\n");
            const body = [title && `Title: ${title}`, `Pages: ${pdf.getPageCount()}`, extracted || "(No simple text operators found — scanned PDFs need OCR.)"]
              .filter(Boolean)
              .join("\n\n");
            setText(body);
            setStatus("Done");
          } catch (e) {
            setStatus(e instanceof Error ? e.message : "Failed");
          }
        }}
      />
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => downloadText(text, "pdf-text.txt")} disabled={!text}>
        Download TXT
      </Button>
      <Status>{status}</Status>
    </Panel>
  );
}

export function PdfToWord() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="application/pdf"
        onFiles={async ([file]) => {
          if (!file) return;
          setStatus("Converting…");
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const raw = new TextDecoder("latin1").decode(bytes);
          const chunks = [...raw.matchAll(/\(([^)]{2,200})\)\s*Tj/g)].map((m) => m[1]);
          const lines = chunks.length
            ? chunks
            : [`PDF with ${pdf.getPageCount()} page(s)`, "No embedded text operators found."];
          const doc = new Document({
            sections: [{ children: lines.map((line) => new Paragraph({ children: [new TextRun(line)] })) }],
          });
          downloadBlob(await Packer.toBlob(doc), "pdf.docx");
          setStatus("Downloaded pdf.docx");
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function PdfToImages() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="application/pdf"
        label="PDF → page images (rasterize via canvas placeholder pages)"
        onFiles={async ([file]) => {
          if (!file) return;
          setStatus("Preparing pages…");
          const pdf = await PDFDocument.load(await file.arrayBuffer());
          const zip = new JSZip();
          const count = pdf.getPageCount();
          for (let i = 0; i < count; i++) {
            const page = pdf.getPage(i);
            const { width, height } = page.getSize();
            const canvas = document.createElement("canvas");
            canvas.width = Math.min(1200, Math.floor(width));
            canvas.height = Math.floor((height / width) * canvas.width);
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#334155";
            ctx.font = "24px sans-serif";
            ctx.fillText(`Page ${i + 1}`, 40, 60);
            ctx.fillText("(Full vector raster needs PDF.js worker — page stub exported)", 40, 100);
            const blob = await canvasToBlob(canvas, "image/png");
            zip.file(`page-${i + 1}.png`, blob);
          }
          downloadBlob(await zip.generateAsync({ type: "blob" }), "pdf-pages.zip");
          setStatus(`Exported ${count} page placeholder(s). For true raster, add pdf.js later.`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function PdfMerge() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="application/pdf"
        multiple
        label="Drop multiple PDFs to merge"
        onFiles={async (files) => {
          if (files.length < 2) {
            setStatus("Select at least 2 PDFs");
            return;
          }
          const out = await PDFDocument.create();
          for (const file of files) {
            const src = await PDFDocument.load(await file.arrayBuffer());
            const pages = await out.copyPages(src, src.getPageIndices());
            pages.forEach((p) => out.addPage(p));
          }
          downloadBlob(
            new Blob([Uint8Array.from(await out.save())], {
              type: "application/pdf",
            }),
            "merged.pdf",
          );
          setStatus(`Merged ${files.length} files`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function PdfSplit() {
  const [status, setStatus] = useState("");
  return (
    <Panel>
      <FileDrop
        accept="application/pdf"
        label="Split PDF into one file per page (ZIP)"
        onFiles={async ([file]) => {
          if (!file) return;
          const src = await PDFDocument.load(await file.arrayBuffer());
          const zip = new JSZip();
          for (const i of src.getPageIndices()) {
            const doc = await PDFDocument.create();
            const [page] = await doc.copyPages(src, [i]);
            doc.addPage(page);
            zip.file(`page-${i + 1}.pdf`, await doc.save());
          }
          downloadBlob(await zip.generateAsync({ type: "blob" }), "split-pages.zip");
          setStatus(`Split into ${src.getPageCount()} files`);
        }}
      />
      <Status>{status}</Status>
    </Panel>
  );
}

export function TextToPdf() {
  const [text, setText] = useState("Hello from ReKit");
  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        onClick={async () => {
          const doc = new jsPDF();
          const lines = doc.splitTextToSize(text, 180);
          doc.text(lines, 15, 20);
          doc.save("text.pdf");
        }}
      >
        Download PDF
      </Button>
    </Panel>
  );
}

export function TextToWord() {
  const [text, setText] = useState("Hello from ReKit");
  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        onClick={async () => {
          const doc = new Document({
            sections: [
              {
                children: text.split(/\n/).map((line) => new Paragraph({ children: [new TextRun(line)] })),
              },
            ],
          });
          downloadBlob(await Packer.toBlob(doc), "text.docx");
        }}
      >
        Download DOCX
      </Button>
    </Panel>
  );
}

export function TextToImage() {
  const [text, setText] = useState("Hello from ReKit");
  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        onClick={async () => {
          const canvas = document.createElement("canvas");
          canvas.width = 1200;
          canvas.height = 630;
          const ctx = canvas.getContext("2d")!;
          const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          g.addColorStop(0, "#0f1729");
          g.addColorStop(1, "#312e81");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 48px Outfit, sans-serif";
          const lines = text.split(/\n/).slice(0, 8);
          lines.forEach((line, i) => ctx.fillText(line, 64, 120 + i * 60));
          downloadBlob(await canvasToBlob(canvas, "image/png"), "text.png");
        }}
      >
        Download PNG
      </Button>
    </Panel>
  );
}
