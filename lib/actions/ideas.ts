"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { resolveOwnedProjectId } from "./helpers";
import { Visibility } from "@prisma/client";

function revalidateIdeaViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ideas");
  revalidatePath("/ideas");
  revalidatePath("/");
}

export async function createIdea(formData: FormData) {
  const session = await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const rawProjectId = String(formData.get("projectId") ?? "").trim() || null;
  const projectId = await resolveOwnedProjectId(rawProjectId, session.user.id);

  await prisma.idea.create({
    data: {
      title,
      body: String(formData.get("body") ?? "").trim() || null,
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      projectId,
      userId: session.user.id,
    },
  });

  revalidateIdeaViews();
}

export async function deleteIdea(id: string) {
  const session = await requireSession();
  await prisma.idea.deleteMany({ where: { id, userId: session.user.id } });
  revalidateIdeaViews();
}

export async function toggleIdeaVisibility(id: string, visibility: Visibility) {
  const session = await requireSession();
  await prisma.idea.updateMany({ where: { id, userId: session.user.id }, data: { visibility } });
  revalidateIdeaViews();
}
