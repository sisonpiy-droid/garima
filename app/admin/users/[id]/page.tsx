import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import {
  formatDate,
  PROJECT_STATUS_LABELS,
  PROJECT_CATEGORY_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from "@/lib/utils";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) notFound();

  const [tasks, projects, journalEntries, ideas, writings, thoughts] = await Promise.all([
    prisma.task.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, include: { project: { select: { name: true } } } }),
    prisma.project.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } }),
    prisma.journalEntry.findMany({ where: { userId: id }, orderBy: { date: "desc" } }),
    prisma.idea.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } }),
    prisma.writing.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } }),
    prisma.thought.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{user.name || user.email.split("@")[0]}</h1>
        <p className="text-sm text-muted">{user.email} · {user.role} · joined {formatDate(user.createdAt)}</p>
        <p className="mt-1 text-xs text-muted">
          Full workspace, including private content — visible only to admin.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Tasks ({tasks.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {tasks.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {tasks.map((t) => (
            <div key={t.id} className="p-3 text-sm">
              <p className={t.status === "COMPLETED" ? "text-muted line-through" : ""}>{t.name}</p>
              <p className="text-xs text-muted">
                {TASK_STATUS_LABELS[t.status]} · {TASK_PRIORITY_LABELS[t.priority]}
                {t.project?.name && <> · {t.project.name}</>}
                {t.dueDate && <> · Due {formatDate(t.dueDate)}</>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Projects ({projects.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {projects.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {projects.map((p) => (
            <div key={p.id} className="p-3 text-sm">
              <p className="font-medium">{p.name} {p.visibility === "PUBLIC" && <span className="text-accent">· Public</span>}</p>
              {p.shortDescription && <p className="text-muted">{p.shortDescription}</p>}
              <p className="text-xs text-muted">{PROJECT_STATUS_LABELS[p.status]} · {PROJECT_CATEGORY_LABELS[p.category]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Journal ({journalEntries.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {journalEntries.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {journalEntries.map((e) => (
            <div key={e.id} className="p-3 text-sm">
              <p className="text-xs text-muted">{formatDate(e.date)} · {e.visibility}</p>
              {e.didToday && <p><span className="text-muted">Did: </span>{e.didToday}</p>}
              {e.workingOn && <p><span className="text-muted">Working on: </span>{e.workingOn}</p>}
              {e.learned && <p><span className="text-muted">Learned: </span>{e.learned}</p>}
              {e.tomorrow && <p><span className="text-muted">Tomorrow: </span>{e.tomorrow}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Ideas ({ideas.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {ideas.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {ideas.map((i) => (
            <div key={i.id} className="p-3 text-sm">
              <p className="font-medium">{i.title} {i.visibility === "PUBLIC" && <span className="text-accent">· Public</span>}</p>
              {i.body && <p className="text-muted">{i.body}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Writing ({writings.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {writings.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {writings.map((w) => (
            <div key={w.id} className="p-3 text-sm">
              <p className="font-medium">{w.title} {w.visibility === "PUBLIC" && <span className="text-accent">· Public</span>}</p>
              {w.excerpt && <p className="text-muted">{w.excerpt}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Thoughts ({thoughts.length})</h2>
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
          {thoughts.length === 0 && <p className="p-4 text-sm text-muted">None.</p>}
          {thoughts.map((t) => (
            <div key={t.id} className="p-3 text-sm">
              <p>{t.body} {t.visibility === "PUBLIC" && <span className="text-accent">· Public</span>}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
