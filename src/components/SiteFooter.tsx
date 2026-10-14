import Link from "next/link";
import { BRAND } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-xl font-bold text-[var(--ink)]">
            {BRAND.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-ink)]">
            Free online file conversion tools. Convert PDFs, images, and text —
            no signup, no upload. Everything stays private in your browser.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            100% Free Forever · No registration
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted-ink)]">
            <li>
              <Link href="/jpg-to-word">JPG to Word</Link>
            </li>
            <li>
              <Link href="/pdf-to-text">PDF to Text</Link>
            </li>
            <li>
              <Link href="/pdf-to-word">PDF to Word</Link>
            </li>
            <li>
              <Link href="/pdf-merge">PDF Merger</Link>
            </li>
            <li>
              <Link href="/pdf-split">PDF Splitter</Link>
            </li>
            <li>
              <Link href="/tools">View All Tools →</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted-ink)]">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted-ink)]">
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-service">Terms of Service</Link>
            </li>
            <li>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-5 text-center text-xs text-[var(--muted-ink)]">
        © {new Date().getFullYear()} {BRAND.name}. Inspired rebuild for learning —
        not affiliated with iUseTools. Built with privacy in mind — your files
        never leave your browser.
      </div>
    </footer>
  );
}
