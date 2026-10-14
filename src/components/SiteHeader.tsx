"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, CATEGORIES, toolsByCategory } from "@/lib/tools";
import { useTheme } from "./ThemeProvider";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-[var(--ink)]">
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-white shadow-md"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6 55%,#06b6d4)",
            }}
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                fill="currentColor"
              />
            </svg>
          </span>
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link className="nav-link" href="/">
            Home
          </Link>
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(
            (key) => (
              <div key={key} className="group relative">
                <button type="button" className="nav-link">
                  {CATEGORIES[key].label.replace(" Tools", "")}
                </button>
                <div className="invisible absolute left-0 top-full z-50 min-w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  {toolsByCategory(key).map((t) => (
                    <Link
                      key={t.slug}
                      href={`/${t.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--muted)]"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
          <Link className="nav-link" href="/blog">
            Blog
          </Link>
          <Link className="nav-link" href="/faq">
            FAQ
          </Link>
          <Link className="nav-link" href="/about">
            About
          </Link>
          <Link
            href="/tools"
            className="ml-2 rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-sm font-semibold text-[var(--surface)]"
          >
            All Tools
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-[var(--ink)]"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "☾" : "☀"}
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/tools" onClick={() => setOpen(false)} className="font-medium">
              All Tools
            </Link>
            <Link href="/faq" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
