import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { getTool } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ReKit`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const tool = post.toolSlug ? getTool(post.toolSlug) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-[var(--muted-ink)]">
        <Link href="/" className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[var(--accent)]">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">{post.category}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-ink)]">
        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[var(--accent)]">
          {post.category}
        </span>
        <span>•</span>
        <span>{post.minutes} min read</span>
        <span>•</span>
        <time dateTime={post.date}>{post.date}</time>
      </div>

      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--ink)]">
        {post.title}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-[var(--muted-ink)]">
        {post.description}
      </p>

      {tool && (
        <aside className="my-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Live In-Browser Tool
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
                {tool.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-ink)]">
                {tool.description}
              </p>
            </div>
            <Link
              href={`/${tool.slug}`}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Open Tool →
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--muted-ink)]">
            🔒 100% private. Files processed locally in your browser. Zero server uploads.
          </p>
        </aside>
      )}

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
          The Problem with Traditional Converters
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--muted-ink)]">
          {post.content.problem}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
          Step-by-Step Guide
        </h2>
        <ol className="mt-6 space-y-6">
          {post.content.steps.map((step, idx) => (
            <li
              key={step.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                {idx + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-ink)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {post.content.tips && post.content.tips.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Pro Tips for Best Results
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted-ink)]">
            {post.content.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {post.content.faq && post.content.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-4">
            {post.content.faq.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="font-display text-base font-bold text-[var(--ink)]">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-ink)]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-[var(--border)] pt-8">
        <Link
          href="/blog"
          className="text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          ← Back to All Guides & Articles
        </Link>
      </div>
    </article>
  );
}
