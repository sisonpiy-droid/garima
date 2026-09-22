"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { ProjectCategory, ProjectStatus, Visibility } from "@prisma/client";

function revalidateProjectViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath("/now");
}

export async function createProject(formData: FormData) {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const project = await prisma.project.create({
    data: {
      name,
      shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
      detailedDescription: String(formData.get("detailedDescription") ?? "").trim() || null,
      status: String(formData.get("status") ?? "PLANNING") as ProjectStatus,
      category: String(formData.get("category") ?? "PERSONAL") as ProjectCategory,
      startDate: new Date(),
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      userId: session.user.id,
    },
  });

  revalidateProjectViews();
  redirect(`/dashboard/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const session = await requireSession();

  const targetDateRaw = String(formData.get("targetDate") ?? "");

  await prisma.project.updateMany({
    where: { id, userId: session.user.id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
      detailedDescription: String(formData.get("detailedDescription") ?? "").trim() || null,
      status: String(formData.get("status") ?? "PLANNING") as ProjectStatus,
      category: String(formData.get("category") ?? "PERSONAL") as ProjectCategory,
      targetDate: targetDateRaw ? new Date(targetDateRaw) : null,
      tags: String(formData.get("tags") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
    },
  });

  revalidateProjectViews();
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function deleteProject(id: string) {
  const session = await requireSession();
  await prisma.project.deleteMany({ where: { id, userId: session.user.id } });
  revalidateProjectViews();
  redirect("/dashboard/projects");
}
