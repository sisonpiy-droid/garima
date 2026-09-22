import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProject, deleteProject } from "@/lib/actions/projects";
import { createTask, deleteTask } from "@/lib/actions/tasks";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_CATEGORY_LABELS,
  TASK_PRIORITY_LABELS,
  formatDate,
} from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ status: "asc" }, { createdAt: "desc" }] },
      ideas: { orderBy: { createdAt: "desc" } },
      thoughts: { orderBy: { createdAt: "desc" } },
      writings: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, project.id);
  const boundCreateTask = createTask;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-accent">{PROJECT_CATEGORY_LABELS[project.category]}</p>
        <h1 className="font-serif text-2xl font-semibold">{project.name}</h1>
        {project.shortDescription && <p className="text-sm text-muted">{project.shortDescription}</p>}
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Tasks</h2>
        <div className="flex flex-col divide-y divide-border">
          {project.tasks.length === 0 && <p className="py-2 text-sm text-muted">No tasks yet.</p>}
          {project.tasks.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center gap-3 py-2">
              <TaskStatusSelect id={t.id} status={t.status} />
              <span className={`flex-1 text-sm ${t.status === "COMPLETED" ? "text-muted line-through" : ""}`}>{t.name}</span>
              <form action={deleteTask.bind(null, t.id)}>
                <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
              </form>
            </div>
          ))}
        </div>
        <form action={boundCreateTask} className="mt-3 flex flex-wrap gap-2">
          <input type="hidden" name="projectId" value={project.id} />
          <input name="name" required placeholder="New task for this project" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm" />
          <select name="priority" defaultValue="MEDIUM" className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm">
            {Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">Add</button>
        </form>
      </section>

      {(project.ideas.length > 0 || project.thoughts.length > 0 || project.writings.length > 0) && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Related Ideas</h3>
            {project.ideas.map((i) => <p key={i.id} className="text-sm">{i.title}</p>)}
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Related Writing</h3>
            {project.writings.map((w) => <p key={w.id} className="text-sm">{w.title}</p>)}
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Related Thoughts</h3>
            {project.thoughts.map((t) => <p key={t.id} className="line-clamp-1 text-sm">{t.body}</p>)}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Edit project</h2>
        <form action={boundUpdate} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input name="name" defaultValue={project.name} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <input name="shortDescription" defaultValue={project.shortDescription ?? ""} placeholder="Short description" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <textarea name="detailedDescription" defaultValue={project.detailedDescription ?? ""} placeholder="Detailed description" rows={3} className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <select name="status" defaultValue={project.status} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(PROJECT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select name="category" defaultValue={project.category} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(PROJECT_CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input name="targetDate" type="date" defaultValue={project.targetDate ? new Date(project.targetDate).toISOString().slice(0, 10) : ""} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input name="tags" defaultValue={project.tags ?? ""} placeholder="Tags" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select name="visibility" defaultValue={project.visibility} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public (shown on /now)</option>
          </select>
          <textarea name="notes" defaultValue={project.notes ?? ""} placeholder="Notes" rows={3} className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white sm:col-span-2">Save changes</button>
        </form>
        <p className="mt-2 text-xs text-muted">Started {formatDate(project.startDate)}</p>
        <form action={deleteProject.bind(null, project.id)} className="mt-4 border-t border-border pt-4">
          <button type="submit" className="text-xs text-muted hover:text-red-600">Delete project</button>
        </form>
      </section>
    </div>
  );
}
