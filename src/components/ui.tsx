"use client";

import { useRef, useState } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
      {children}
    </label>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-40 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2 ${props.className ?? ""}`}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2 ${props.className ?? ""}`}
    />
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-[var(--ink)] text-[var(--surface)] hover:opacity-90"
      : "border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--muted)]";
  return (
    <button type="button" {...props} className={`${base} ${styles} ${props.className ?? ""}`}>
      {children}
    </button>
  );
}

export function FileDrop({
  accept,
  multiple,
  onFiles,
  label = "Drop files here or click to browse",
}: {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles([...e.dataTransfer.files]);
      }}
      className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
        over
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--muted)]"
      }`}
    >
      <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
      <p className="mt-1 text-xs text-[var(--muted-ink)]">{accept ?? "Any supported file"}</p>
      <input
        ref={ref}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => onFiles([...(e.target.files ?? [])])}
      />
    </button>
  );
}

export function Status({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm text-[var(--muted-ink)]">{children}</p>;
}
