import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function IdeasIndexPage() {
  const ideas = await prisma.idea.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Ideas</h1>
      <div className="flex flex-col divide-y divide-border">
        {ideas.length === 0 && <p className="text-sm text-muted">No public ideas yet.</p>}
        {ideas.map((i) => (
          <div key={i.id} className="py-4">
            <p className="font-medium">{i.title}</p>
            {i.body && <p className="text-sm text-muted">{i.body}</p>}
            <p className="text-xs text-muted">
              <Link href={`/u/${i.user.id}`} className="hover:text-accent">
                {i.user.name || i.user.email.split("@")[0]}
              </Link>{" "}
              · {formatDate(i.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
