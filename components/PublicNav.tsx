import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PublicNav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Garima
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/writing" className="hover:text-foreground">
            Writing
          </Link>
          <Link href="/ideas" className="hover:text-foreground">
            Ideas
          </Link>
          <Link href="/thoughts" className="hover:text-foreground">
            Thoughts
          </Link>
          <Link href="/now" className="hover:text-foreground">
            Now
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="rounded-full border border-border px-3 py-1 hover:text-foreground"
          >
            {session ? "Dashboard" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
