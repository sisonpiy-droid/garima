"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { resolveOwnedProjectId } from "./helpers";
import { TaskPriority, TaskStatus } from "@prisma/client";

function revalidateTaskViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
}

export async function quickAddTask(name: string) {
  const session = await requireSession();
  const trimmed = name.trim();
  if (!trimmed) return;

  await prisma.task.create({ data: { name: trimmed, userId: session.user.id } });
  revalidateTaskViews();
}

export async function createTask(formData: FormData) {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const dueDateRaw = String(formData.get("dueDate") ?? "");
  const priority = String(formData.get("priority") ?? "MEDIUM") as TaskPriority;
  const tags = String(formData.get("tags") ?? "").trim() || null;
  const rawProjectId = String(formData.get("projectId") ?? "").trim() || null;
  const projectId = await resolveOwnedProjectId(rawProjectId, session.user.id);

  await prisma.task.create({
    data: {
      name,
      description,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      priority,
      tags,
      projectId,
      userId: session.user.id,
    },
  });

  revalidateTaskViews();
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  const session = await requireSession();

  await prisma.task.updateMany({
    where: { id, userId: session.user.id },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  revalidateTaskViews();
}

export async function deleteTask(id: string) {
  const session = await requireSession();
  await prisma.task.deleteMany({ where: { id, userId: session.user.id } });
  revalidateTaskViews();
}
