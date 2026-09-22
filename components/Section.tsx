import type { ReactNode } from "react";
import Link from "next/link";

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
        {action && (
          <Link href={action.href} className="text-xs text-accent hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
