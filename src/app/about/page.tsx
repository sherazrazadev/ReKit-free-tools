import { BRAND } from "@/lib/tools";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-like">
      <h1 className="font-display text-4xl font-extrabold">About {BRAND.name}</h1>
      <p className="mt-4 text-[var(--muted-ink)] leading-relaxed">
        {BRAND.name} is a from-scratch rebuild of a free browser-tools product
        shape (inspired by public UX on iusetools.site). All conversion logic in
        this repo is original client-side code. Not affiliated with iUseTools.
      </p>
      <p className="mt-4 text-[var(--muted-ink)] leading-relaxed">
        Stack: Next.js, TypeScript, Tailwind. OCR via Tesseract.js. PDFs via
        pdf-lib / jsPDF. Word via docx.
      </p>
    </article>
  );
}
