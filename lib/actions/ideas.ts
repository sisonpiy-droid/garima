"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Visibility } from "@prisma/client";

function revalidateIdeaViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ideas");
  revalidatePath("/ideas");
}

export async function createIdea(formData: FormData) {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await prisma.idea.create({
    data: {
      title,
      body: String(formData.get("body") ?? "").trim() || null,
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      projectId: String(formData.get("projectId") ?? "").trim() || null,
    },
  });

  revalidateIdeaViews();
}

export async function deleteIdea(id: string) {
  await requireSession();
  await prisma.idea.delete({ where: { id } });
  revalidateIdeaViews();
}

export async function toggleIdeaVisibility(id: string, visibility: Visibility) {
  await requireSession();
  await prisma.idea.update({ where: { id }, data: { visibility } });
  revalidateIdeaViews();
}
