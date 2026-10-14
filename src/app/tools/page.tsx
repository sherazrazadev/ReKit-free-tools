import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "All Tools" };

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">All Tools</h1>
      <p className="mt-2 text-[var(--muted-ink)]">
        {TOOLS.length} browser-based utilities. Nothing leaves your device.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
