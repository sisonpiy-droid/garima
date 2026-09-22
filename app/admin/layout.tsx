import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/session";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-6">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-serif text-lg font-semibold">
            Admin
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            Back to your dashboard
          </Link>
        </div>
        <SignOutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}
