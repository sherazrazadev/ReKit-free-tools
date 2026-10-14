import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolRunner } from "@/components/tools/ToolRunner";
import { getTool, TOOLS } from "@/lib/tools";

const STATIC = new Set([
  "about",
  "faq",
  "blog",
  "help",
  "contact",
  "privacy-policy",
  "terms-of-service",
  "cookie-policy",
  "disclaimer",
  "tools",
]);

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return { title: tool.name, description: tool.description };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (STATIC.has(slug)) notFound();
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
        {tool.category} tool
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">{tool.name}</h1>
      <p className="mt-3 text-[var(--muted-ink)]">{tool.description}</p>
      <p className="mt-2 text-xs text-[var(--muted-ink)]">
        Processing runs in your browser. Files are not uploaded to a server.
      </p>
      <div className="mt-8" style={{ ["--accent" as string]: tool.accent }}>
        <ToolRunner tool={tool} />
      </div>
    </div>
  );
}
