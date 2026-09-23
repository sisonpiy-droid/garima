import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PublicNav } from "@/components/PublicNav";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        <span>Garima&apos;s Mind </span>
        <Link
          href={session ? "/dashboard" : "/login"}
          aria-label={session ? "Dashboard" : "Sign in"}
          className="text-muted/40 hover:text-muted"
        >
          &middot;
        </Link>
      </footer>
    </>
  );
}
