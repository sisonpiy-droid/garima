"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Visibility } from "@prisma/client";
import { slugify } from "@/lib/utils";

function revalidateWritingViews(slug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/writing");
  revalidatePath("/writing");
  revalidatePath("/");
  if (slug) revalidatePath(`/writing/${slug}`);
}

async function uniqueSlug(base: string) {
  let slug = base || "untitled";
  let n = 1;
  while (await prisma.writing.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createWriting(formData: FormData) {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const visibility = String(formData.get("visibility") ?? "PRIVATE") as Visibility;
  const slug = await uniqueSlug(slugify(title));

  await prisma.writing.create({
    data: {
      title,
      slug,
      body: String(formData.get("body") ?? "").trim(),
      excerpt: String(formData.get("excerpt") ?? "").trim() || null,
      tags: String(formData.get("tags") ?? "").trim() || null,
      visibility,
      publishedAt: visibility === "PUBLIC" ? new Date() : null,
      projectId: String(formData.get("projectId") ?? "").trim() || null,
    },
  });

  revalidateWritingViews(slug);
  redirect("/dashboard/writing");
}

export async function deleteWriting(id: string, slug: string) {
  await requireSession();
  await prisma.writing.delete({ where: { id } });
  revalidateWritingViews(slug);
}

export async function toggleWritingVisibility(id: string, slug: string, visibility: Visibility) {
  await requireSession();
  await prisma.writing.update({
    where: { id },
    data: {
      visibility,
      publishedAt: visibility === "PUBLIC" ? new Date() : null,
    },
  });
  revalidateWritingViews(slug);
}
