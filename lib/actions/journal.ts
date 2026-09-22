"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Visibility } from "@prisma/client";

function revalidateJournalViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/journal");
}

export async function createJournalEntry(formData: FormData) {
  const session = await requireSession();

  await prisma.journalEntry.create({
    data: {
      didToday: String(formData.get("didToday") ?? "").trim() || null,
      workingOn: String(formData.get("workingOn") ?? "").trim() || null,
      learned: String(formData.get("learned") ?? "").trim() || null,
      tomorrow: String(formData.get("tomorrow") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
      userId: session.user.id,
    },
  });

  revalidateJournalViews();
}

export async function deleteJournalEntry(id: string) {
  const session = await requireSession();
  await prisma.journalEntry.deleteMany({ where: { id, userId: session.user.id } });
  revalidateJournalViews();
}

export async function toggleJournalVisibility(id: string, visibility: Visibility) {
  const session = await requireSession();
  await prisma.journalEntry.updateMany({ where: { id, userId: session.user.id }, data: { visibility } });
  revalidateJournalViews();
}
