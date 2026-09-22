import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PublicNav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/about" className="font-serif text-xl font-semibold tracking-tight">
          Idea Revolver
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/writing" className="hidden hover:text-foreground sm:inline">
            Writing
          </Link>
          <Link href="/ideas" className="hidden hover:text-foreground sm:inline">
            Ideas
          </Link>
          <Link href="/thoughts" className="hidden hover:text-foreground sm:inline">
            Thoughts
          </Link>
          <Link href="/now" className="hidden hover:text-foreground sm:inline">
            Now
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard/writing"
                className="rounded-full bg-foreground px-3.5 py-1.5 text-background hover:opacity-85"
              >
                Write
              </Link>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-foreground px-3.5 py-1.5 text-background hover:opacity-85"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
