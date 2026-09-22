"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Visibility } from "@prisma/client";

function revalidateThoughtViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/thoughts");
  revalidatePath("/thoughts");
}

export async function createThought(formData: FormData) {
  await requireSession();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.thought.create({
    data: {
      body,
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      projectId: String(formData.get("projectId") ?? "").trim() || null,
    },
  });

  revalidateThoughtViews();
}

export async function deleteThought(id: string) {
  await requireSession();
  await prisma.thought.delete({ where: { id } });
  revalidateThoughtViews();
}

export async function toggleThoughtVisibility(id: string, visibility: Visibility) {
  await requireSession();
  await prisma.thought.update({ where: { id }, data: { visibility } });
  revalidateThoughtViews();
}
