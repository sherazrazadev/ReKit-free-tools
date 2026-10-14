import { BRAND, TOOLS } from "@/lib/tools";

export const metadata = { title: "FAQ" };

const faqs = [
  {
    q: `Is ${BRAND.name} really free?`,
    a: `Yes. All ${TOOLS.length}+ tools are available without payment or accounts.`,
  },
  {
    q: "Are my files safe?",
    a: "Processing is designed to run in your browser. We do not upload your files to an application server for these tools.",
  },
  {
    q: "Do I need an account?",
    a: "No registration, email, or personal information is required.",
  },
  {
    q: "What file types are supported?",
    a: "PDF, JPG/JPEG, PNG, WebP, TXT, CSV, JSON, Markdown, and more depending on the tool.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">
        Frequently Asked Questions
      </h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            open
          >
            <summary className="cursor-pointer font-display text-lg font-bold">
              {f.q}
            </summary>
            <p className="mt-3 text-sm text-[var(--muted-ink)]">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
