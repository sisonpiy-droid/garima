import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ThoughtsIndexPage() {
  const thoughts = await prisma.thought.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Thoughts</h1>
      <div className="flex flex-col divide-y divide-border">
        {thoughts.length === 0 && <p className="text-sm text-muted">No public thoughts yet.</p>}
        {thoughts.map((t) => (
          <div key={t.id} className="py-4">
            <p className="text-sm">{t.body}</p>
            <p className="text-xs text-muted">{formatDate(t.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
