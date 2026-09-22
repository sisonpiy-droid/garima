import Link from "next/link";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/SignOutButton";

const links = [
  { href: "/dashboard", label: "Today" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/journal", label: "Journal" },
  { href: "/dashboard/ideas", label: "Ideas" },
  { href: "/dashboard/writing", label: "Writing" },
  { href: "/dashboard/thoughts", label: "Thoughts" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl gap-8 px-6 py-6">
      <aside className="w-40 shrink-0">
        <Link href="/dashboard" className="mb-6 block font-serif text-base font-semibold">
          Idea Revolver
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-2 py-1.5 text-muted hover:bg-card hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-2">
          <Link href="/about" className="text-sm text-muted hover:text-foreground">
            View public site
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-16">{children}</main>
    </div>
  );
}
