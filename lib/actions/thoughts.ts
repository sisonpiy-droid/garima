"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { resolveOwnedProjectId } from "./helpers";
import { Visibility } from "@prisma/client";

function revalidateThoughtViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/thoughts");
  revalidatePath("/thoughts");
  revalidatePath("/");
}

export async function createThought(formData: FormData) {
  const session = await requireSession();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const rawProjectId = String(formData.get("projectId") ?? "").trim() || null;
  const projectId = await resolveOwnedProjectId(rawProjectId, session.user.id);

  await prisma.thought.create({
    data: {
      body,
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      projectId,
      userId: session.user.id,
    },
  });

  revalidateThoughtViews();
}

export async function deleteThought(id: string) {
  const session = await requireSession();
  await prisma.thought.deleteMany({ where: { id, userId: session.user.id } });
  revalidateThoughtViews();
}

export async function toggleThoughtVisibility(id: string, visibility: Visibility) {
  const session = await requireSession();
  await prisma.thought.updateMany({ where: { id, userId: session.user.id }, data: { visibility } });
  revalidateThoughtViews();
}
