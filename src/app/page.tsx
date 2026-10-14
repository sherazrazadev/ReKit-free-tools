import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import {
  BRAND,
  CATEGORIES,
  TOOLS,
  toolsByCategory,
  type ToolCategory,
} from "@/lib/tools";

const order: ToolCategory[] = ["image", "pdf", "text", "utility"];

export default function HomePage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="animate-rise text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            100% Free · No Signup · {TOOLS.length}+ Tools · Browser-Based
          </p>
          <h1 className="animate-rise-delay mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {BRAND.description}
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900"
            >
              Explore All Tools
            </Link>
            <Link
              href="/jpg-to-word"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur"
            >
              Try JPG to Word
            </Link>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {[
              [`${TOOLS.length}+`, "Free Tools"],
              ["100+", "Languages"],
              ["100%", "Private"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-extrabold">{n}</div>
                <div className="text-sm text-white/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="all-tools" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          All {TOOLS.length}+ Free Tools
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--ink)] md:text-4xl">
          Everything You Need — Right Here
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted-ink)]">
          No account needed. No file size tricks. No hidden paywall. Pick a tool
          and start converting in seconds.
        </p>

        <div className="mt-12 space-y-14">
          {order.map((cat) => (
            <div key={cat}>
              <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
                {CATEGORIES[cat].label} ({toolsByCategory(cat).length})
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-ink)]">
                {CATEGORIES[cat].blurb}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory(cat).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            How It Works
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">
            Three Steps. That&apos;s It.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Open a Tool", "Choose any free tool. No account required."],
              ["02", "Upload or Paste", "Drop a file, paste, or type directly."],
              ["03", "Convert & Download", "Everything stays in your browser."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-[var(--border)] p-6">
                <div className="font-display text-sm font-bold text-[var(--accent)]">
                  Step {n}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm text-[var(--muted-ink)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Why {BRAND.name}
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">
          Built Different. Built for You.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["100% Private", "Files stay in your browser. Zero server uploads."],
            ["Instant Results", "Client-side processing delivers results fast."],
            ["OCR Ready", "Image text extraction runs locally via Tesseract."],
            ["Always Free", "No hidden tiers, no credit card."],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm text-[var(--muted-ink)]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="hero-glow overflow-hidden rounded-3xl px-8 py-12 text-center text-white md:px-16">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            No signup. No waiting. No file uploads to our servers. Just open a
            tool and start converting.
          </p>
          <Link
            href="/tools"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900"
          >
            Browse All {TOOLS.length}+ Tools
          </Link>
        </div>
      </section>
    </>
  );
}
