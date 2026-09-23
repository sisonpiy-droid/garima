import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { createThought, deleteThought, toggleThoughtVisibility } from "@/lib/actions/thoughts";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import { formatDate } from "@/lib/utils";

export default async function ThoughtsPage() {
  const userId = await requireUserId();

  const [thoughts, projects] = await Promise.all([
    prisma.thought.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { project: { select: { name: true } } } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Thoughts</h1>

      <form action={createThought} className="rounded-2xl border border-border bg-card shadow-sm shadow-black/5 p-4">
        <textarea name="body" required placeholder="A few things I've been thinking about..." rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <div className="mt-2 flex flex-wrap gap-2">
          <input name="tags" placeholder="Tags" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select name="projectId" defaultValue="" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">No project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select name="visibility" defaultValue="PRIVATE" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink">Save thought</button>
        </div>
      </form>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
        {thoughts.length === 0 && <p className="p-4 text-sm text-muted">Nothing here yet.</p>}
        {thoughts.map((t) => (
          <div key={t.id} className="p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-sm">{t.body}</p>
              <div className="flex shrink-0 items-center gap-2">
                <VisibilityToggle visibility={t.visibility} onToggle={toggleThoughtVisibility.bind(null, t.id)} />
                <form action={deleteThought.bind(null, t.id)}>
                  <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
                </form>
              </div>
            </div>
            <p className="text-xs text-muted">
              {formatDate(t.createdAt)}
              {t.project?.name && <> · {t.project.name}</>}
              {t.tags && <> · {t.tags}</>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
