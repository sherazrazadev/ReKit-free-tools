export const metadata = { title: "Help Center" };
export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">Help Center</h1>
      <p className="mt-4 text-[var(--muted-ink)]">
        Open any tool, drop a file or paste text, then download the result. If a
        tool fails, try a smaller file or a different format. OCR works best on
        clear, high-contrast images.
      </p>
    </div>
  );
}
