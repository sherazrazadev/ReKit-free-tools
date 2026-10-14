import Link from "next/link";

export const metadata = { title: "Blog" };

const posts = [
  {
    href: "/jpg-to-word",
    title: "How to Convert JPG to Word",
    blurb: "Use on-device OCR to turn image text into an editable DOCX.",
  },
  {
    href: "/image-to-text",
    title: "Extract Text from Image (OCR)",
    blurb: "Tesseract.js runs locally in your browser.",
  },
  {
    href: "/image-to-pdf",
    title: "Convert Image to PDF",
    blurb: "Merge one or more images into a single PDF document.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">Blog & Guides</h1>
      <div className="mt-8 space-y-4">
        {posts.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:shadow-md"
          >
            <h2 className="font-display text-xl font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">{p.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
