import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AboutPage() {
  const [writings, ideas, thoughts] = await Promise.all([
    prisma.writing.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { publishedAt: "desc" },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.idea.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.thought.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <div>
        <h1 className="font-serif text-3xl font-semibold">What people are publishing</h1>
        <p className="mt-1 text-muted">
          Writing, ideas, and things being built on Idea Revolver —{" "}
          <Link href="/now" className="text-accent hover:underline">see what&apos;s in progress right now</Link>.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-lg font-semibold">Recently Published</h2>
        <div className="flex flex-col divide-y divide-border">
          {writings.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
          {writings.map((w) => (
            <div key={w.id} className="py-5">
              <Link href={`/writing/${w.slug}`} className="group">
                <p className="font-serif text-xl font-semibold group-hover:text-accent">{w.title}</p>
                {w.excerpt && <p className="mt-1 text-muted">{w.excerpt}</p>}
              </Link>
              <p className="mt-2 text-xs text-muted">
                <Link href={`/u/${w.user.id}`} className="hover:text-accent">
                  {w.user.name || w.user.email.split("@")[0]}
                </Link>{" "}
                · {formatDate(w.publishedAt)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {ideas.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg font-semibold">Ideas</h2>
          <div className="flex flex-col gap-3">
            {ideas.map((i) => (
              <p key={i.id} className="text-sm">
                {i.title}{" "}
                <span className="text-muted">
                  — <Link href={`/u/${i.user.id}`} className="hover:text-accent">{i.user.name || i.user.email.split("@")[0]}</Link>
                </span>
              </p>
            ))}
          </div>
        </section>
      )}

      {thoughts.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg font-semibold">Thoughts</h2>
          <div className="flex flex-col gap-3">
            {thoughts.map((t) => (
              <p key={t.id} className="text-sm">
                {t.body}{" "}
                <span className="text-muted">
                  — <Link href={`/u/${t.user.id}`} className="hover:text-accent">{t.user.name || t.user.email.split("@")[0]}</Link>
                </span>
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
