import Link from "next/link";
import type { ToolDef } from "@/lib/tools";

export function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{ boxShadow: `0 0 0 1px color-mix(in oklab, ${tool.accent} 18%, transparent)` }}
    >
      {tool.popular && (
        <span className="mb-3 w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
          Popular
        </span>
      )}
      <span
        className="mb-4 grid h-12 w-12 place-items-center rounded-xl text-white"
        style={{ background: tool.accent }}
        aria-hidden
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <h3 className="font-display text-lg font-bold text-[var(--ink)]">
        {tool.name}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--muted-ink)]">
        {tool.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {tool.inputs.slice(0, 2).map((i) => (
          <span
            key={i}
            className="rounded-full bg-[var(--muted)] px-2.5 py-1 font-medium text-[var(--muted-ink)]"
          >
            {i}
          </span>
        ))}
        <span className="text-[var(--muted-ink)]">→</span>
        {tool.outputs.slice(0, 2).map((o) => (
          <span
            key={o}
            className="rounded-full border px-2.5 py-1 font-medium"
            style={{ borderColor: tool.accent, color: tool.accent }}
          >
            {o}
          </span>
        ))}
        <span className="ml-auto font-semibold text-[var(--ink)] opacity-0 transition group-hover:opacity-100">
          Open Tool
        </span>
      </div>
    </Link>
  );
}
