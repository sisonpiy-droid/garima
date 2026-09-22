import { prisma } from "@/lib/prisma";
import { PROJECT_CATEGORY_LABELS } from "@/lib/utils";

export default async function NowPage() {
  const projects = await prisma.project.findMany({
    where: { visibility: "PUBLIC", status: { in: ["ACTIVE", "PLANNING"] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">What I&apos;m working on</h1>
        <p className="text-sm text-muted">Updated as things change.</p>
      </div>

      <div className="flex flex-col gap-5">
        {projects.length === 0 && <p className="text-sm text-muted">Nothing public right now.</p>}
        {projects.map((p) => (
          <div key={p.id}>
            <p className="text-xs uppercase tracking-wide text-accent">{PROJECT_CATEGORY_LABELS[p.category]}</p>
            <h2 className="text-lg font-medium">{p.name}</h2>
            {p.shortDescription && <p className="text-sm text-muted">{p.shortDescription}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
