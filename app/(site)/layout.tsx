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
        <p>Garima&apos;s Mind</p>
        <Link href={session ? "/dashboard" : "/login"} className="mt-1 inline-block hover:text-foreground">
          {session ? "Dashboard" : "Sign in"}
        </Link>
      </footer>
    </>
  );
}
