import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { createWriting, deleteWriting, toggleWritingVisibility } from "@/lib/actions/writing";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import { formatDate } from "@/lib/utils";

export default async function WritingPage() {
  const userId = await requireUserId();

  const [writings, projects] = await Promise.all([
    prisma.writing.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { project: { select: { name: true } } } }),
    prisma.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Writing</h1>

      <details className="rounded-2xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">+ New writing</summary>
        <form action={createWriting} className="mt-3 flex flex-col gap-2">
          <input name="title" required placeholder="Title" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input name="excerpt" placeholder="Excerpt (optional)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea name="body" placeholder="Write in markdown..." rows={8} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono" />
          <div className="flex flex-wrap gap-2">
            <input name="tags" placeholder="Tags" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <select name="projectId" defaultValue="" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select name="visibility" defaultValue="PRIVATE" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="PRIVATE">Draft (private)</option>
              <option value="PUBLIC">Publish now</option>
            </select>
          </div>
          <button type="submit" className="self-start rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">Save</button>
        </form>
      </details>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {writings.length === 0 && <p className="p-4 text-sm text-muted">Nothing drafted yet.</p>}
        {writings.map((w) => (
          <div key={w.id} className="p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="font-medium">{w.title}</p>
              <div className="flex shrink-0 items-center gap-2">
                <VisibilityToggle visibility={w.visibility} onToggle={toggleWritingVisibility.bind(null, w.id, w.slug)} />
                <form action={deleteWriting.bind(null, w.id, w.slug)}>
                  <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
                </form>
              </div>
            </div>
            {w.excerpt && <p className="text-sm text-muted">{w.excerpt}</p>}
            <p className="mt-1 text-xs text-muted">
              {formatDate(w.createdAt)}
              {w.project?.name && <> · {w.project.name}</>}
              {w.tags && <> · {w.tags}</>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
