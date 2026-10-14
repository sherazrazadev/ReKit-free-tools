"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import * as Diff from "diff";
import QRCode from "qrcode";
import { Button, Input, Label, Panel, Status, TextArea } from "@/components/ui";
import { downloadBlob, downloadText } from "@/lib/download";

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, minutes };
  }, [text]);

  return (
    <Panel>
      <Label>Your text</Label>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text…" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Words", stats.words],
          ["Characters", stats.chars],
          ["No spaces", stats.charsNoSpace],
          ["Sentences", stats.sentences],
          ["Read time", `${stats.minutes}m`],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-xl bg-[var(--muted)] p-3 text-center">
            <div className="text-xs text-[var(--muted-ink)]">{k}</div>
            <div className="mt-1 font-display text-xl font-bold">{v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function CaseConverter() {
  const [text, setText] = useState("");
  const modes = {
    UPPERCASE: () => text.toUpperCase(),
    lowercase: () => text.toLowerCase(),
    "Title Case": () =>
      text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    "Sentence case": () =>
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()),
    "camelCase": () =>
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    "snake_case": () =>
      text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
  } as const;
  const [mode, setMode] = useState<keyof typeof modes>("UPPERCASE");
  const out = modes[mode]();

  return (
    <Panel className="space-y-3">
      <Label>Input</Label>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
          <Button key={m} variant={mode === m ? "primary" : "ghost"} onClick={() => setMode(m)}>
            {m}
          </Button>
        ))}
      </div>
      <Label>Output</Label>
      <TextArea value={out} readOnly />
      <Button onClick={() => navigator.clipboard.writeText(out)}>Copy</Button>
    </Panel>
  );
}

export function Base64Tool() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  return (
    <Panel className="space-y-3">
      <Label>Input</Label>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            try {
              setOut(btoa(unescape(encodeURIComponent(text))));
              setErr("");
            } catch {
              setErr("Encode failed");
            }
          }}
        >
          Encode
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            try {
              setOut(decodeURIComponent(escape(atob(text))));
              setErr("");
            } catch {
              setErr("Decode failed — invalid Base64");
            }
          }}
        >
          Decode
        </Button>
      </div>
      <Label>Output</Label>
      <TextArea value={out} readOnly />
      {err && <Status>{err}</Status>}
    </Panel>
  );
}

export function JsonFormatter() {
  const [text, setText] = useState('{\n  "hello": "world"\n}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  return (
    <Panel className="space-y-3">
      <Label>JSON</Label>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} className="font-mono" />
      <div className="flex gap-2">
        <Button
          onClick={() => {
            try {
              setOut(JSON.stringify(JSON.parse(text), null, 2));
              setErr("");
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Invalid JSON");
            }
          }}
        >
          Format
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            try {
              setOut(JSON.stringify(JSON.parse(text)));
              setErr("");
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Invalid JSON");
            }
          }}
        >
          Minify
        </Button>
      </div>
      <TextArea value={out} readOnly className="font-mono" />
      {err && <Status>{err}</Status>}
    </Panel>
  );
}

export function QrGenerator() {
  const [text, setText] = useState("https://example.com");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(text || " ", { width: 320, margin: 2 }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [text]);

  return (
    <Panel className="space-y-3">
      <Label>Content</Label>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="QR code" className="mx-auto rounded-xl border border-[var(--border)]" />
      )}
      <Button
        onClick={() => {
          if (!dataUrl) return;
          fetch(dataUrl)
            .then((r) => r.blob())
            .then((b) => downloadBlob(b, "qrcode.png"));
        }}
      >
        Download PNG
      </Button>
    </Panel>
  );
}

export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pwd, setPwd] = useState("");

  function gen() {
    let alphabet = "";
    if (upper) alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) alphabet += "abcdefghijklmnopqrstuvwxyz";
    if (nums) alphabet += "0123456789";
    if (syms) alphabet += "!@#$%^&*()-_=+[]{};:,.?";
    if (!alphabet) return;
    const bytes = new Uint32Array(len);
    crypto.getRandomValues(bytes);
    setPwd(Array.from(bytes, (b) => alphabet[b % alphabet.length]).join(""));
  }

  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Panel className="space-y-3">
      <Label>Length: {len}</Label>
      <input type="range" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" />
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          ["Uppercase", upper, setUpper],
          ["Lowercase", lower, setLower],
          ["Numbers", nums, setNums],
          ["Symbols", syms, setSyms],
        ].map(([label, val, set]) => (
          <label key={label as string} className="flex items-center gap-2">
            <input type="checkbox" checked={val as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} />
            {label as string}
          </label>
        ))}
      </div>
      <Input value={pwd} readOnly className="font-mono" />
      <div className="flex gap-2">
        <Button onClick={gen}>Generate</Button>
        <Button variant="ghost" onClick={() => navigator.clipboard.writeText(pwd)}>
          Copy
        </Button>
      </div>
    </Panel>
  );
}

export function UrlEncoder() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={() => setOut(encodeURIComponent(text))}>Encode</Button>
        <Button variant="ghost" onClick={() => { try { setOut(decodeURIComponent(text)); } catch { setOut("Invalid encoding"); } }}>
          Decode
        </Button>
      </div>
      <TextArea value={out} readOnly />
    </Panel>
  );
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);
  function gen() {
    setList(Array.from({ length: count }, () => crypto.randomUUID()));
  }
  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Panel className="space-y-3">
      <Label>Count</Label>
      <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value)} />
      <Button onClick={gen}>Generate</Button>
      <TextArea value={list.join("\n")} readOnly className="font-mono" />
      <Button variant="ghost" onClick={() => navigator.clipboard.writeText(list.join("\n"))}>
        Copy all
      </Button>
    </Panel>
  );
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export function LoremIpsum() {
  const [paras, setParas] = useState(3);
  const text = Array.from({ length: paras }, () => LOREM).join("\n\n");
  return (
    <Panel className="space-y-3">
      <Label>Paragraphs: {paras}</Label>
      <input type="range" min={1} max={10} value={paras} onChange={(e) => setParas(+e.target.value)} className="w-full" />
      <TextArea value={text} readOnly />
      <Button onClick={() => navigator.clipboard.writeText(text)}>Copy</Button>
    </Panel>
  );
}

export function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  async function run() {
    const enc = new TextEncoder().encode(text);
    const algos: Record<string, string> = {
      "SHA-1": "SHA-1",
      "SHA-256": "SHA-256",
      "SHA-384": "SHA-384",
      "SHA-512": "SHA-512",
    };
    const next: Record<string, string> = {};
    for (const [label, algo] of Object.entries(algos)) {
      const buf = await crypto.subtle.digest(algo, enc);
      next[label] = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(next);
  }

  return (
    <Panel className="space-y-3">
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={run}>Hash</Button>
      {Object.entries(hashes).map(([k, v]) => (
        <div key={k}>
          <Label>{k}</Label>
          <Input value={v} readOnly className="font-mono text-xs" />
        </div>
      ))}
    </Panel>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const rgb = useMemo(() => {
    try {
      return hexToRgb(hex);
    } catch {
      return { r: 0, g: 0, b: 0 };
    }
  }, [hex]);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <Panel className="space-y-3">
      <div className="flex items-center gap-4">
        <input type="color" value={hex.slice(0, 7)} onChange={(e) => setHex(e.target.value)} className="h-14 w-14 cursor-pointer rounded-lg" />
        <Input value={hex} onChange={(e) => setHex(e.target.value)} className="font-mono" />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Input readOnly value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        <Input readOnly value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
        <Input readOnly value={hex.toUpperCase()} />
      </div>
      <div className="h-24 rounded-xl" style={{ background: hex }} />
    </Panel>
  );
}

export function CsvToJson() {
  const [csv, setCsv] = useState("name,age\nAda,36\nGrace,45");
  const [out, setOut] = useState("");
  function convert() {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return setOut("[]");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, (cols[i] ?? "").trim()]));
    });
    setOut(JSON.stringify(rows, null, 2));
  }
  return (
    <Panel className="space-y-3">
      <TextArea value={csv} onChange={(e) => setCsv(e.target.value)} className="font-mono" />
      <Button onClick={convert}>Convert</Button>
      <TextArea value={out} readOnly className="font-mono" />
      <Button variant="ghost" onClick={() => downloadText(out, "data.json", "application/json")}>
        Download JSON
      </Button>
    </Panel>
  );
}

export function MarkdownPreview() {
  const [md, setMd] = useState("# Hello\n\nWrite **markdown** here.");
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel>
        <Label>Markdown</Label>
        <TextArea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-80 font-mono" />
      </Panel>
      <Panel>
        <Label>Preview</Label>
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      </Panel>
    </div>
  );
}

export function TextDiffTool() {
  const [a, setA] = useState("line one\nline two\nline three");
  const [b, setB] = useState("line one\nline 2\nline three\nline four");
  const parts = Diff.diffLines(a, b);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <Label>Original</Label>
          <TextArea value={a} onChange={(e) => setA(e.target.value)} />
        </Panel>
        <Panel>
          <Label>Changed</Label>
          <TextArea value={b} onChange={(e) => setB(e.target.value)} />
        </Panel>
      </div>
      <Panel>
        <Label>Diff</Label>
        <pre className="overflow-auto rounded-xl bg-[var(--muted)] p-3 text-sm">
          {parts.map((p, i) => (
            <span
              key={i}
              className={
                p.added ? "bg-emerald-200 text-emerald-950 dark:bg-emerald-900/50 dark:text-emerald-100" :
                p.removed ? "bg-rose-200 text-rose-950 dark:bg-rose-900/50 dark:text-rose-100" : ""
              }
            >
              {p.value}
            </span>
          ))}
        </pre>
      </Panel>
    </div>
  );
}

export function BaseConverter() {
  const [value, setValue] = useState("255");
  const [from, setFrom] = useState(10);
  const bases = [2, 8, 10, 16];
  const n = parseInt(value, from);
  const ok = !Number.isNaN(n);
  return (
    <Panel className="space-y-3">
      <Label>Value</Label>
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
      <Label>From base</Label>
      <div className="flex flex-wrap gap-2">
        {bases.map((b) => (
          <Button key={b} variant={from === b ? "primary" : "ghost"} onClick={() => setFrom(b)}>
            {b}
          </Button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {bases.map((b) => (
          <Input key={b} readOnly value={ok ? n.toString(b).toUpperCase() : "—"} className="font-mono" />
        ))}
      </div>
    </Panel>
  );
}
