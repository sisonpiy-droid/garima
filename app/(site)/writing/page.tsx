import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function WritingIndexPage() {
  const writings = await prisma.writing.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { publishedAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Writing</h1>
      <div className="flex flex-col divide-y divide-border">
        {writings.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
        {writings.map((w) => (
          <div key={w.id} className="py-4">
            <Link href={`/writing/${w.slug}`} className="group">
              <p className="font-medium group-hover:text-accent">{w.title}</p>
              {w.excerpt && <p className="text-sm text-muted">{w.excerpt}</p>}
            </Link>
            <p className="text-xs text-muted">
              <Link href={`/u/${w.user.id}`} className="hover:text-accent">
                {w.user.name || w.user.email.split("@")[0]}
              </Link>{" "}
              · {formatDate(w.publishedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
