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
  await requireSession();

  await prisma.journalEntry.create({
    data: {
      didToday: String(formData.get("didToday") ?? "").trim() || null,
      workingOn: String(formData.get("workingOn") ?? "").trim() || null,
      learned: String(formData.get("learned") ?? "").trim() || null,
      tomorrow: String(formData.get("tomorrow") ?? "").trim() || null,
      visibility: String(formData.get("visibility") ?? "PRIVATE") as Visibility,
    },
  });

  revalidateJournalViews();
}

export async function deleteJournalEntry(id: string) {
  await requireSession();
  await prisma.journalEntry.delete({ where: { id } });
  revalidateJournalViews();
}

export async function toggleJournalVisibility(id: string, visibility: Visibility) {
  await requireSession();
  await prisma.journalEntry.update({ where: { id }, data: { visibility } });
  revalidateJournalViews();
}
