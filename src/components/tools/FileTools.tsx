"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import JSZip from "jszip";
import {
  Button,
  FileDrop,
  Input,
  Label,
  Panel,
  ProgressBar,
  Select,
  Status,
  TextArea,
} from "@/components/ui";
import { canvasToBlob, downloadBlob, downloadText } from "@/lib/download";
import {
  OCR_LANGS,
  canvasToBmpBlob,
  imageFileToCanvas,
  imageFileToEmbeddable,
  ocrImage,
  wrapText,
} from "@/lib/image";
import { extractPdfText, renderPdfPages } from "@/lib/pdf";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong";
}

function LangSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>OCR language</Label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {OCR_LANGS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function JpgToWord() {
  const [lang, setLang] = useState("eng");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <LangSelect value={lang} onChange={setLang} />
      <FileDrop
        accept="image/*"
        busy={busy}
        label="Drop an image for OCR → Word"
        hint="JPG, PNG, WebP, BMP — processed in your browser"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setPct(0);
          setStatus("Starting OCR…");
          try {
            const text = await ocrImage(file, lang, (p, s) => {
              if (p !== null) setPct(p);
              setStatus(s);
            });
            if (!text.trim()) throw new Error("No text detected in this image");
            const doc = new Document({
              sections: [
                {
                  children: text
                    .split(/\n/)
                    .map((line) => new Paragraph({ children: [new TextRun(line)] })),
                },
              ],
            });
            downloadBlob(await Packer.toBlob(doc), "ocr.docx");
            setTone("ok");
            setStatus("Downloaded ocr.docx");
            setPct(100);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      {pct !== null && busy && <ProgressBar value={pct} />}
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageToText() {
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <LangSelect value={lang} onChange={setLang} />
      <FileDrop
        accept="image/*"
        busy={busy}
        label="Drop an image to extract text"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setPct(0);
          setStatus("Starting OCR…");
          try {
            const out = await ocrImage(file, lang, (p, s) => {
              if (p !== null) setPct(p);
              setStatus(s);
            });
            setText(out);
            setTone("ok");
            setStatus(out.trim() ? "Done — text stays on your device" : "No text detected");
            setPct(100);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      {pct !== null && busy && <ProgressBar value={pct} />}
      <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Extracted text…" />
      <Button onClick={() => downloadText(text, "ocr.txt")} disabled={!text.trim() || busy}>
        Download TXT
      </Button>
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageToPdf() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="image/*"
        multiple
        busy={busy}
        label="Drop one or more images → PDF"
        hint="JPG, PNG, WebP, BMP and other browser-readable formats"
        onFiles={async (files) => {
          if (!files.length) return;
          setBusy(true);
          setTone("muted");
          setStatus(`Building PDF (${files.length} image${files.length > 1 ? "s" : ""})…`);
          try {
            const pdf = await PDFDocument.create();
            for (let i = 0; i < files.length; i++) {
              setStatus(`Embedding image ${i + 1}/${files.length}…`);
              const { bytes, kind, width, height } = await imageFileToEmbeddable(
                files[i]!,
                "jpeg",
              );
              const img =
                kind === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
              const page = pdf.addPage([width, height]);
              page.drawImage(img, { x: 0, y: 0, width, height });
            }
            downloadBlob(
              new Blob([Uint8Array.from(await pdf.save())], { type: "application/pdf" }),
              "images.pdf",
            );
            setTone("ok");
            setStatus(`Merged ${files.length} image(s) → images.pdf`);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageResizer() {
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [keep, setKeep] = useState(true);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width</Label>
          <Input type="number" min={1} value={w} onChange={(e) => setW(+e.target.value)} />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            type="number"
            min={1}
            value={h}
            disabled={keep}
            onChange={(e) => setH(+e.target.value)}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
        Keep aspect ratio
      </label>
      <div className="flex gap-2">
        <Button variant={format === "image/png" ? "primary" : "ghost"} onClick={() => setFormat("image/png")}>
          PNG
        </Button>
        <Button variant={format === "image/jpeg" ? "primary" : "ghost"} onClick={() => setFormat("image/jpeg")}>
          JPG
        </Button>
      </div>
      <FileDrop
        accept="image/*"
        busy={busy}
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          try {
            const canvas = await imageFileToCanvas(file);
            const tw = Math.max(1, w);
            const th = keep
              ? Math.max(1, Math.round((canvas.height / canvas.width) * tw))
              : Math.max(1, h);
            const out = document.createElement("canvas");
            out.width = tw;
            out.height = th;
            out.getContext("2d")!.drawImage(canvas, 0, 0, tw, th);
            const blob = await canvasToBlob(out, format, 0.92);
            const ext = format === "image/png" ? "png" : "jpg";
            downloadBlob(blob, `resized-${tw}x${th}.${ext}`);
            setTone("ok");
            setStatus(`Saved ${tw}×${th}.${ext}`);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageCompressor() {
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp" | "image/png">("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["JPEG", "image/jpeg"],
            ["WebP", "image/webp"],
            ["PNG", "image/png"],
          ] as const
        ).map(([label, mime]) => (
          <Button
            key={mime}
            variant={format === mime ? "primary" : "ghost"}
            onClick={() => setFormat(mime)}
          >
            {label}
          </Button>
        ))}
      </div>
      {format !== "image/png" && (
        <>
          <Label>
            Quality: {quality.toFixed(2)}
          </Label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(+e.target.value)}
            className="w-full"
          />
        </>
      )}
      <FileDrop
        accept="image/*"
        busy={busy}
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setStatus("Compressing…");
          try {
            const canvas = await imageFileToCanvas(file);
            const blob = await canvasToBlob(
              canvas,
              format,
              format === "image/png" ? undefined : quality,
            );
            const ext = format === "image/jpeg" ? "jpg" : format.split("/")[1];
            downloadBlob(blob, `compressed.${ext}`);
            setTone("ok");
            setStatus(
              `Original ~${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB (${ext})`,
            );
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageConverter() {
  const [format, setFormat] = useState<"png" | "jpeg" | "webp" | "bmp">("png");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["png", "jpeg", "webp", "bmp"] as const).map((f) => (
          <Button
            key={f}
            variant={format === f ? "primary" : "ghost"}
            onClick={() => setFormat(f)}
          >
            {f === "jpeg" ? "JPG" : f.toUpperCase()}
          </Button>
        ))}
      </div>
      <FileDrop
        accept="image/*"
        busy={busy}
        hint="Convert between PNG, JPG, WebP, and BMP"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setStatus("Converting…");
          try {
            const canvas = await imageFileToCanvas(file);
            let blob: Blob;
            let ext: string;
            if (format === "bmp") {
              blob = canvasToBmpBlob(canvas);
              ext = "bmp";
            } else {
              const mime =
                format === "png"
                  ? "image/png"
                  : format === "webp"
                    ? "image/webp"
                    : "image/jpeg";
              blob = await canvasToBlob(canvas, mime, 0.92);
              ext = format === "jpeg" ? "jpg" : format;
            }
            downloadBlob(blob, `converted.${ext}`);
            setTone("ok");
            setStatus(`Converted to ${ext.toUpperCase()}`);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function ImageWatermark() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [mark, setMark] = useState("ReKit");
  const [opacity, setOpacity] = useState(0.45);
  const [position, setPosition] = useState<
    "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("center");
  const [wmFile, setWmFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  function place(
    baseW: number,
    baseH: number,
    markW: number,
    markH: number,
  ): { x: number; y: number } {
    const pad = Math.round(Math.min(baseW, baseH) * 0.04);
    switch (position) {
      case "top-left":
        return { x: pad, y: pad };
      case "top-right":
        return { x: baseW - markW - pad, y: pad };
      case "bottom-left":
        return { x: pad, y: baseH - markH - pad };
      case "bottom-right":
        return { x: baseW - markW - pad, y: baseH - markH - pad };
      default:
        return { x: (baseW - markW) / 2, y: (baseH - markH) / 2 };
    }
  }

  return (
    <Panel className="space-y-3">
      <div className="flex gap-2">
        <Button variant={mode === "text" ? "primary" : "ghost"} onClick={() => setMode("text")}>
          Text
        </Button>
        <Button variant={mode === "image" ? "primary" : "ghost"} onClick={() => setMode("image")}>
          Image
        </Button>
      </div>
      {mode === "text" ? (
        <div>
          <Label>Watermark text</Label>
          <Input value={mark} onChange={(e) => setMark(e.target.value)} />
        </div>
      ) : (
        <div>
          <Label>Watermark image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setWmFile(e.target.files?.[0] ?? null)}
          />
        </div>
      )}
      <Label>Opacity: {opacity.toFixed(2)}</Label>
      <input
        type="range"
        min={0.1}
        max={1}
        step={0.05}
        value={opacity}
        onChange={(e) => setOpacity(+e.target.value)}
        className="w-full"
      />
      <Label>Position</Label>
      <Select
        value={position}
        onChange={(e) => setPosition(e.target.value as typeof position)}
      >
        <option value="center">Center</option>
        <option value="top-left">Top left</option>
        <option value="top-right">Top right</option>
        <option value="bottom-left">Bottom left</option>
        <option value="bottom-right">Bottom right</option>
      </Select>
      <FileDrop
        accept="image/*"
        busy={busy}
        label="Drop the photo to watermark"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setStatus("Applying watermark…");
          try {
            const base = await imageFileToCanvas(file);
            const ctx = base.getContext("2d")!;
            ctx.save();
            ctx.globalAlpha = opacity;

            if (mode === "text") {
              const size = Math.max(24, Math.floor(base.width / 16));
              ctx.font = `bold ${size}px Outfit, sans-serif`;
              ctx.textBaseline = "top";
              const metrics = ctx.measureText(mark || " ");
              const markW = metrics.width;
              const markH = size * 1.2;
              const { x, y } = place(base.width, base.height, markW, markH);
              ctx.fillStyle = "#ffffff";
              ctx.strokeStyle = "rgba(0,0,0,0.45)";
              ctx.lineWidth = Math.max(1, size / 18);
              ctx.strokeText(mark, x, y);
              ctx.fillText(mark, x, y);
            } else {
              if (!wmFile) throw new Error("Choose a watermark image first");
              const wm = await imageFileToCanvas(wmFile);
              const targetW = Math.round(base.width * 0.28);
              const targetH = Math.round((wm.height / wm.width) * targetW);
              const { x, y } = place(base.width, base.height, targetW, targetH);
              ctx.drawImage(wm, x, y, targetW, targetH);
            }
            ctx.restore();
            downloadBlob(await canvasToBlob(base, "image/png"), "watermarked.png");
            setTone("ok");
            setStatus("Downloaded watermarked.png");
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function PdfToText() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="application/pdf,.pdf"
        busy={busy}
        label="Drop a PDF to extract text"
        hint="Uses PDF.js text layer in your browser"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setPct(0);
          setStatus("Reading PDF…");
          try {
            const { text: extracted, pages, title } = await extractPdfText(
              await file.arrayBuffer(),
              (page, total) => {
                setPct(Math.round((page / total) * 100));
                setStatus(`Extracting page ${page}/${total}…`);
              },
            );
            const header = [
              title && `Title: ${title}`,
              `Pages: ${pages}`,
              "",
            ]
              .filter(Boolean)
              .join("\n");
            const body = extracted
              ? `${header}${extracted}`
              : `${header}(No extractable text layer. This may be a scanned PDF — try Image to Text / JPG to Word after PDF to Images.)`;
            setText(body);
            setTone(extracted ? "ok" : "err");
            setStatus(
              extracted
                ? `Extracted text from ${pages} page(s)`
                : "No text layer found (likely scanned)",
            );
            setPct(100);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <ProgressBar value={pct} />}
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-64"
        placeholder="Extracted text appears here…"
      />
      <Button onClick={() => downloadText(text, "pdf-text.txt")} disabled={!text.trim() || busy}>
        Download TXT
      </Button>
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function PdfToWord() {
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="application/pdf,.pdf"
        busy={busy}
        label="Drop a PDF → Word (DOCX)"
        hint="Extracts text layer with PDF.js, then builds DOCX"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setPct(0);
          setStatus("Reading PDF…");
          try {
            const { text, pages, title } = await extractPdfText(
              await file.arrayBuffer(),
              (page, total) => {
                setPct(Math.round((page / total) * 100));
                setStatus(`Extracting page ${page}/${total}…`);
              },
            );
            if (!text.trim()) {
              throw new Error(
                "No extractable text layer. Export pages with PDF to Images, then use OCR.",
              );
            }
            const lines = [
              ...(title ? [title, ""] : []),
              `Source: ${file.name} (${pages} pages)`,
              "",
              ...text.split(/\n/),
            ];
            const doc = new Document({
              sections: [
                {
                  children: lines.map(
                    (line) => new Paragraph({ children: [new TextRun(line)] }),
                  ),
                },
              ],
            });
            downloadBlob(await Packer.toBlob(doc), "pdf.docx");
            setTone("ok");
            setStatus(`Downloaded pdf.docx (${pages} pages)`);
            setPct(100);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <ProgressBar value={pct} />}
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function PdfToImages() {
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant={format === "image/png" ? "primary" : "ghost"}
          onClick={() => setFormat("image/png")}
        >
          PNG
        </Button>
        <Button
          variant={format === "image/jpeg" ? "primary" : "ghost"}
          onClick={() => setFormat("image/jpeg")}
        >
          JPG
        </Button>
      </div>
      <FileDrop
        accept="application/pdf,.pdf"
        busy={busy}
        label="Drop a PDF → page images (ZIP)"
        hint="Renders real pages with PDF.js"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setPct(0);
          setStatus("Rendering pages…");
          try {
            const blobs = await renderPdfPages(
              await file.arrayBuffer(),
              format,
              2,
              (page, total) => {
                setPct(Math.round((page / total) * 100));
                setStatus(`Rendering page ${page}/${total}…`);
              },
            );
            const zip = new JSZip();
            const ext = format === "image/png" ? "png" : "jpg";
            blobs.forEach((blob, i) => zip.file(`page-${i + 1}.${ext}`, blob));
            downloadBlob(await zip.generateAsync({ type: "blob" }), "pdf-pages.zip");
            setTone("ok");
            setStatus(`Exported ${blobs.length} page image(s)`);
            setPct(100);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <ProgressBar value={pct} />}
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function PdfMerge() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="application/pdf,.pdf"
        multiple
        busy={busy}
        label="Drop multiple PDFs to merge"
        onFiles={async (files) => {
          if (files.length < 2) {
            setTone("err");
            setStatus("Select at least 2 PDFs");
            return;
          }
          setBusy(true);
          setTone("muted");
          setStatus("Merging…");
          try {
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
            setTone("ok");
            setStatus(`Merged ${files.length} files`);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function PdfSplit() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"muted" | "ok" | "err">("muted");

  return (
    <Panel className="space-y-3">
      <FileDrop
        accept="application/pdf,.pdf"
        busy={busy}
        label="Split PDF into one file per page (ZIP)"
        onFiles={async ([file]) => {
          if (!file) return;
          setBusy(true);
          setTone("muted");
          setStatus("Splitting…");
          try {
            const src = await PDFDocument.load(await file.arrayBuffer());
            const zip = new JSZip();
            for (const i of src.getPageIndices()) {
              const doc = await PDFDocument.create();
              const [page] = await doc.copyPages(src, [i]);
              doc.addPage(page);
              zip.file(`page-${i + 1}.pdf`, await doc.save());
            }
            downloadBlob(await zip.generateAsync({ type: "blob" }), "split-pages.zip");
            setTone("ok");
            setStatus(`Split into ${src.getPageCount()} files`);
          } catch (e) {
            setTone("err");
            setStatus(errMsg(e));
          } finally {
            setBusy(false);
          }
        }}
      />
      <Status tone={tone}>{status}</Status>
    </Panel>
  );
}

export function TextToPdf() {
  const [text, setText] = useState("Hello from ReKit");
  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        onClick={() => {
          const doc = new jsPDF();
          const lines = doc.splitTextToSize(text, 180);
          let y = 20;
          for (const line of lines) {
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, 15, y);
            y += 7;
          }
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
                children: text
                  .split(/\n/)
                  .map((line) => new Paragraph({ children: [new TextRun(line)] })),
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
  const [text, setText] = useState("Hello from ReKit\nConvert text to a shareable image.");
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [width, setWidth] = useState(1200);
  const [status, setStatus] = useState("");

  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} className="min-h-48" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width (px)</Label>
          <Input
            type="number"
            min={400}
            max={2400}
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
          />
        </div>
        <div>
          <Label>Format</Label>
          <div className="flex gap-2">
            <Button
              variant={format === "image/png" ? "primary" : "ghost"}
              onClick={() => setFormat("image/png")}
            >
              PNG
            </Button>
            <Button
              variant={format === "image/jpeg" ? "primary" : "ghost"}
              onClick={() => setFormat("image/jpeg")}
            >
              JPG
            </Button>
          </div>
        </div>
      </div>
      <Button
        onClick={async () => {
          const pad = 64;
          const fontSize = 42;
          const lineHeight = 58;
          const canvas = document.createElement("canvas");
          const measure = document.createElement("canvas").getContext("2d")!;
          measure.font = `bold ${fontSize}px Outfit, sans-serif`;
          const maxTextW = Math.max(200, width - pad * 2);
          const lines = wrapText(measure, text || " ", maxTextW);
          const height = Math.max(400, pad * 2 + lines.length * lineHeight + 40);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          g.addColorStop(0, "#0f1729");
          g.addColorStop(1, "#312e81");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${fontSize}px Outfit, sans-serif`;
          ctx.textBaseline = "top";
          lines.forEach((line, i) => ctx.fillText(line, pad, pad + i * lineHeight));
          const ext = format === "image/png" ? "png" : "jpg";
          downloadBlob(await canvasToBlob(canvas, format, 0.92), `text.${ext}`);
          setStatus(`Downloaded text.${ext} (${width}×${height})`);
        }}
      >
        Download image
      </Button>
      <Status tone="ok">{status}</Status>
    </Panel>
  );
}
