import { prisma } from "@/lib/prisma";
import { createTask, deleteTask } from "@/lib/actions/tasks";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, formatDate } from "@/lib/utils";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      include: { project: { select: { name: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Tasks</h1>

      <form action={createTask} className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input name="name" required placeholder="Task name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input name="tags" placeholder="Tags (comma separated)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input name="dueDate" type="date" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select name="priority" defaultValue="MEDIUM" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l} priority</option>
            ))}
          </select>
          <select name="projectId" defaultValue="" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2">
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <textarea name="description" placeholder="Description (optional)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" rows={2} />
        </div>
        <button type="submit" className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">
          Add task
        </button>
      </form>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {tasks.length === 0 && <p className="p-4 text-sm text-muted">No tasks yet.</p>}
        {tasks.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-3 p-3">
            <TaskStatusSelect id={t.id} status={t.status} />
            <div className="min-w-0 flex-1">
              <p className={`text-sm ${t.status === "COMPLETED" ? "text-muted line-through" : ""}`}>{t.name}</p>
              <p className="text-xs text-muted">
                {t.project?.name && <>{t.project.name} · </>}
                {t.dueDate && <>Due {formatDate(t.dueDate)} · </>}
                {TASK_PRIORITY_LABELS[t.priority]}
                {t.tags && <> · {t.tags}</>}
              </p>
            </div>
            <form action={deleteTask.bind(null, t.id)}>
              <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
            </form>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted">
        Statuses: {Object.values(TASK_STATUS_LABELS).join(" · ")}
      </p>
    </div>
  );
}
