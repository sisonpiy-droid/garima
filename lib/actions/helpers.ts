import { prisma } from "@/lib/prisma";

/** Returns projectId only if it belongs to userId, otherwise null (prevents attaching content to someone else's project). */
export async function resolveOwnedProjectId(projectId: string | null, userId: string) {
  if (!projectId) return null;
  const project = await prisma.project.findFirst({ where: { id: projectId, userId }, select: { id: true } });
  return project?.id ?? null;
}
