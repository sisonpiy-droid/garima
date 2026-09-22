import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function WritingIndexPage() {
  const writings = await prisma.writing.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Writing</h1>
      <div className="flex flex-col divide-y divide-border">
        {writings.length === 0 && <p className="text-sm text-muted">Nothing published yet.</p>}
        {writings.map((w) => (
          <Link key={w.id} href={`/writing/${w.slug}`} className="py-4 hover:text-accent">
            <p className="font-medium">{w.title}</p>
            {w.excerpt && <p className="text-sm text-muted">{w.excerpt}</p>}
            <p className="text-xs text-muted">{formatDate(w.publishedAt)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
