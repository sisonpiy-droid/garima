import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { tasks: true, projects: true, journalEntries: true, ideas: true, writings: true, thoughts: true },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">All accounts</h1>
        <p className="text-sm text-muted">{users.length} registered {users.length === 1 ? "account" : "accounts"}.</p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {users.map((u) => (
          <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-background">
            <div>
              <p className="font-medium">
                {u.name || u.email.split("@")[0]}
                {u.role === "ADMIN" && <span className="ml-2 rounded-full border border-accent px-2 py-0.5 text-xs text-accent">Admin</span>}
              </p>
              <p className="text-sm text-muted">{u.email}</p>
              <p className="mt-1 text-xs text-muted">Joined {formatDate(u.createdAt)}</p>
            </div>
            <p className="shrink-0 text-xs text-muted">
              {u._count.tasks} tasks · {u._count.projects} projects · {u._count.journalEntries} journal ·{" "}
              {u._count.ideas} ideas · {u._count.writings} writing · {u._count.thoughts} thoughts
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
