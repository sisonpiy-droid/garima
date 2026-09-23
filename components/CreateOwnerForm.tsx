"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateOwnerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ email: string; oneTimePassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json().catch(() => ({}));

    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setResult({ email, oneTimePassword: data.oneTimePassword });
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.oneTimePassword);
      setCopied(true);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the
      // password is still visible to copy manually.
    }
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-black/5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Account created</h2>
        <p className="mb-3 text-sm">
          One-time password for <span className="font-medium">{result.email}</span>:
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm">
            {result.oneTimePassword}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm hover:bg-background"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          This is shown only once and isn&apos;t stored anywhere retrievable. Share it with her directly
          (not through anyone else) — she&apos;ll be asked to set her own password the first time she signs in.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-3 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-ink"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm shadow-black/5 p-4">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Create the owner account</h2>
      <p className="mb-3 text-xs text-muted">
        There&apos;s no owner account yet. Create it here — a one-time password is generated for you to share
        with her; she&apos;ll set her own password on first sign-in.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-ink disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
