import Link from "next/link";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-6 sm:flex-row sm:gap-8">
      <aside className="w-full shrink-0 sm:w-40">
        <Link href="/dashboard" className="mb-4 block font-serif text-base font-semibold sm:mb-6">
          Idea Revolver
        </Link>
        <nav className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-2 text-sm sm:mx-0 sm:flex-col sm:overflow-visible sm:px-0 sm:pb-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 whitespace-nowrap rounded-lg px-2 py-1.5 text-muted hover:bg-card hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-8 sm:flex-col sm:items-start sm:gap-2">
          {session?.user.role === "ADMIN" && (
            <Link href="/admin" className="text-accent hover:underline">
              Admin
            </Link>
          )}
          <Link href="/about" className="text-muted hover:text-foreground">
            View public site
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-16">{children}</main>
    </div>
  );
}
