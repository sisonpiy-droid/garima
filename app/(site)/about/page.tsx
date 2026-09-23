import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AboutPage() {
  const owner = await prisma.user.findFirst({
    where: { role: "USER" },
    select: { id: true, name: true },
  });

  if (!owner) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold">Coming soon</h1>
        <p className="mt-2 text-muted">This space hasn&apos;t been set up yet.</p>
      </div>
    );
  }

  const displayName = owner.name || "Garima";

  const [writings, ideas, thoughts] = await Promise.all([
    prisma.writing.findMany({
      where: { userId: owner.id, visibility: "PUBLIC" },
      orderBy: { publishedAt: "desc" },
      take: 10,
    }),
    prisma.idea.findMany({ where: { userId: owner.id, visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.thought.findMany({ where: { userId: owner.id, visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-xl text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-semibold">{displayName}</h1>
          <p className="mt-1 text-muted">
            Writing, ideas, and things I&apos;m building —{" "}
            <Link href="/now" className="text-accent hover:underline">what I&apos;m working on right now</Link>.
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-serif text-lg font-semibold">Recently Published</h2>
        <div className="flex flex-col divide-y divide-border">
          {writings.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
          {writings.map((w) => (
            <Link key={w.id} href={`/writing/${w.slug}`} className="group py-5">
              <p className="font-serif text-xl font-semibold group-hover:text-accent">{w.title}</p>
              {w.excerpt && <p className="mt-1 text-muted">{w.excerpt}</p>}
              <p className="mt-2 text-xs text-muted">{formatDate(w.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </section>

      {ideas.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg font-semibold">Ideas</h2>
          <div className="flex flex-col gap-3">
            {ideas.map((i) => <p key={i.id} className="text-sm">{i.title}</p>)}
          </div>
        </section>
      )}

      {thoughts.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg font-semibold">Thoughts</h2>
          <div className="flex flex-col gap-3">
            {thoughts.map((t) => <p key={t.id} className="text-sm">{t.body}</p>)}
          </div>
        </section>
      )}
    </div>
  );
}
