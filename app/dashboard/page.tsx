import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/Section";
import { QuickAddTask } from "@/components/QuickAddTask";
import { TaskRow } from "@/components/TaskRow";
import { formatDate, PROJECT_STATUS_LABELS } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardHome() {
  const [activeTasks, completedTasks, activeProjects, ideas, writing, thoughts] =
    await Promise.all([
      prisma.task.findMany({
        where: { status: { in: ["TODO", "IN_PROGRESS"] } },
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.task.findMany({
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 5,
      }),
      prisma.project.findMany({
        where: { status: "ACTIVE" },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.idea.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.writing.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.thought.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{greeting()} 👋</h1>
        <p className="text-sm text-muted">Here&apos;s where things stand today.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { href: "/dashboard/ideas", label: "+ New Idea" },
          { href: "/dashboard/writing", label: "+ New Writing" },
          { href: "/dashboard/thoughts", label: "+ New Thought" },
          { href: "/dashboard/tasks", label: "+ New Task" },
          { href: "/dashboard/projects", label: "+ New Project" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-accent"
          >
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Section title="Today" action={{ href: "/dashboard/tasks", label: "View all" }}>
          <div className="flex flex-col divide-y divide-border">
            {activeTasks.length === 0 && <p className="py-2 text-sm text-muted">Nothing on your plate. Nice.</p>}
            {activeTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <QuickAddTask />
          </div>
        </Section>

        <Section title="Currently Working On" action={{ href: "/dashboard/projects", label: "View all" }}>
          <div className="flex flex-col gap-3">
            {activeProjects.length === 0 && <p className="text-sm text-muted">No active projects yet.</p>}
            {activeProjects.map((p) => (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="block rounded-lg border border-border p-3 hover:border-accent">
                <p className="text-sm font-medium">{p.name}</p>
                {p.shortDescription && <p className="text-xs text-muted">{p.shortDescription}</p>}
                <p className="mt-1 text-xs text-accent">{PROJECT_STATUS_LABELS[p.status]}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Recent Ideas" action={{ href: "/dashboard/ideas", label: "View all" }}>
          <div className="flex flex-col divide-y divide-border">
            {ideas.length === 0 && <p className="py-2 text-sm text-muted">No ideas captured yet.</p>}
            {ideas.map((i) => (
              <div key={i.id} className="py-2 text-sm">
                <p className="font-medium">{i.title}</p>
                <p className="text-xs text-muted">{formatDate(i.createdAt)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recent Writing" action={{ href: "/dashboard/writing", label: "View all" }}>
          <div className="flex flex-col divide-y divide-border">
            {writing.length === 0 && <p className="py-2 text-sm text-muted">Nothing drafted yet.</p>}
            {writing.map((w) => (
              <div key={w.id} className="py-2 text-sm">
                <p className="font-medium">{w.title}</p>
                <p className="text-xs text-muted">
                  {w.visibility === "PUBLIC" ? "Published" : "Draft"} · {formatDate(w.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recent Thoughts" action={{ href: "/dashboard/thoughts", label: "View all" }}>
          <div className="flex flex-col divide-y divide-border">
            {thoughts.length === 0 && <p className="py-2 text-sm text-muted">Nothing here yet.</p>}
            {thoughts.map((t) => (
              <div key={t.id} className="py-2 text-sm">
                <p className="line-clamp-2">{t.body}</p>
                <p className="text-xs text-muted">{formatDate(t.createdAt)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Progress">
          <div className="flex flex-col divide-y divide-border">
            {completedTasks.length === 0 && <p className="py-2 text-sm text-muted">Nothing completed yet.</p>}
            {completedTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2 py-1.5 text-sm text-muted">
                <span className="text-accent">✓</span>
                <span className="line-through">{t.name}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
