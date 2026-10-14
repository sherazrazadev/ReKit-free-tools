export const metadata = { title: "Cookie Policy" };
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">Cookie Policy</h1>
      <p className="mt-4 text-[var(--muted-ink)]">
        Theme preference may be stored in localStorage (`rekit-theme`). No ad
        cookies are shipped in this rebuild.
      </p>
    </div>
  );
}
