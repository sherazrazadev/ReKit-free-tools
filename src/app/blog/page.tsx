import Link from "next/link";
import { allBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog & Guides | ReKit",
  description:
    "Practical guides and tutorials on converting, compressing, and formatting files locally in your browser with complete privacy.",
};

export default function BlogPage() {
  const posts = allBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Knowledge Base & Tutorials
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-[var(--ink)] sm:text-5xl">
          Blog & Guides
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-ink)]">
          Step-by-step tutorials on client-side file conversions, PDF manipulation, OCR text extraction, and developer utilities.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent)] hover:shadow-lg"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-ink)]">
              <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[var(--accent)]">
                {post.category}
              </span>
              <span>•</span>
              <span>{post.minutes} min read</span>
              <span>•</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--accent)]">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="mt-2 text-base leading-relaxed text-[var(--muted-ink)]">
              {post.description}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
              <span className="text-xs text-[var(--muted-ink)]">By {post.author}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="font-semibold text-[var(--accent)] group-hover:underline"
              >
                Read Guide →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
