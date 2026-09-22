"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { TaskPriority, TaskStatus } from "@prisma/client";

function revalidateTaskViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/projects");
}

export async function quickAddTask(name: string) {
  await requireSession();
  const trimmed = name.trim();
  if (!trimmed) return;

  await prisma.task.create({ data: { name: trimmed } });
  revalidateTaskViews();
}

export async function createTask(formData: FormData) {
  await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const dueDateRaw = String(formData.get("dueDate") ?? "");
  const priority = String(formData.get("priority") ?? "MEDIUM") as TaskPriority;
  const tags = String(formData.get("tags") ?? "").trim() || null;
  const projectId = String(formData.get("projectId") ?? "").trim() || null;

  await prisma.task.create({
    data: {
      name,
      description,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      priority,
      tags,
      projectId,
    },
  });

  revalidateTaskViews();
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  await requireSession();

  await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  revalidateTaskViews();
}

export async function deleteTask(id: string) {
  await requireSession();
  await prisma.task.delete({ where: { id } });
  revalidateTaskViews();
}
