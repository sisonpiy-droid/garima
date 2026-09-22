import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [writings, ideas, thoughts] = await Promise.all([
    prisma.writing.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    prisma.idea.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.thought.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-semibold">Hi, I&apos;m Garima.</h1>
        <p className="mt-2 text-muted">
          I write, capture ideas, and build things. Here&apos;s what I&apos;ve shared publicly —
          and <Link href="/now" className="text-accent hover:underline">what I&apos;m working on right now</Link>.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Recently Published</h2>
        <div className="flex flex-col divide-y divide-border">
          {writings.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
          {writings.map((w) => (
            <Link key={w.id} href={`/writing/${w.slug}`} className="py-3 hover:text-accent">
              <p className="font-medium">{w.title}</p>
              {w.excerpt && <p className="text-sm text-muted">{w.excerpt}</p>}
              <p className="text-xs text-muted">{formatDate(w.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </section>

      {ideas.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Ideas</h2>
          <div className="flex flex-col gap-2">
            {ideas.map((i) => <p key={i.id} className="text-sm">{i.title}</p>)}
          </div>
        </section>
      )}

      {thoughts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Thoughts</h2>
          <div className="flex flex-col gap-2">
            {thoughts.map((t) => <p key={t.id} className="text-sm">{t.body}</p>)}
          </div>
        </section>
      )}
    </div>
  );
}
