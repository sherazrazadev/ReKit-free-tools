export const metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-4 text-[var(--muted-ink)] leading-relaxed">
        Tool processing is implemented client-side in this project. We do not
        operate a file-upload API for these converters. Analytics or hosting
        providers you add later have their own policies.
      </p>
    </div>
  );
}
