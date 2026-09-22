import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { createIdea, deleteIdea, toggleIdeaVisibility } from "@/lib/actions/ideas";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import { formatDate } from "@/lib/utils";

export default async function IdeasPage() {
  const userId = await requireUserId();

  const [ideas, projects] = await Promise.all([
    prisma.idea.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { project: { select: { name: true } } } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Ideas</h1>

      <form action={createIdea} className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-2">
          <input name="title" required placeholder="Idea title" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea name="body" placeholder="Details (optional)" rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-2">
            <input name="tags" placeholder="Tags" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select name="projectId" defaultValue="" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select name="visibility" defaultValue="PRIVATE" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </select>
            <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">Capture idea</button>
          </div>
        </div>
      </form>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {ideas.length === 0 && <p className="p-4 text-sm text-muted">No ideas captured yet.</p>}
        {ideas.map((i) => (
          <div key={i.id} className="p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="font-medium">{i.title}</p>
              <div className="flex items-center gap-2">
                <VisibilityToggle visibility={i.visibility} onToggle={toggleIdeaVisibility.bind(null, i.id)} />
                <form action={deleteIdea.bind(null, i.id)}>
                  <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
                </form>
              </div>
            </div>
            {i.body && <p className="text-sm text-muted">{i.body}</p>}
            <p className="mt-1 text-xs text-muted">
              {formatDate(i.createdAt)}
              {i.project?.name && <> · {i.project.name}</>}
              {i.tags && <> · {i.tags}</>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
