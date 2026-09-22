import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProject } from "@/lib/actions/projects";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_CATEGORY_LABELS,
} from "@/lib/utils";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: { tasks: { select: { status: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-semibold">Projects</h1>

      <details className="rounded-2xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">+ New project</summary>
        <form action={createProject} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input name="name" required placeholder="Project name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <input name="shortDescription" placeholder="Short description" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <select name="status" defaultValue="PLANNING" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(PROJECT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select name="category" defaultValue="PERSONAL" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(PROJECT_CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input name="tags" placeholder="Tags (comma separated)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2" />
          <select name="visibility" defaultValue="PRIVATE" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public (shown on /now)</option>
          </select>
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white sm:col-span-2">
            Create project
          </button>
        </form>
      </details>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.length === 0 && <p className="text-sm text-muted">No projects yet.</p>}
        {projects.map((p) => {
          const done = p.tasks.filter((t) => t.status === "COMPLETED").length;
          return (
            <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="rounded-2xl border border-border bg-card p-4 hover:border-accent">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium">{p.name}</p>
                <span className="text-xs text-accent">{PROJECT_STATUS_LABELS[p.status]}</span>
              </div>
              {p.shortDescription && <p className="text-sm text-muted">{p.shortDescription}</p>}
              <p className="mt-2 text-xs text-muted">
                {PROJECT_CATEGORY_LABELS[p.category]} · {done}/{p.tasks.length} tasks done
                {p.visibility === "PUBLIC" && " · Public"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
