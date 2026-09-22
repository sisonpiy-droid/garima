export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatTags(tags: string[]): string {
  return tags.map((t) => t.trim()).filter(Boolean).join(", ");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  COLLEGE: "College",
  STARTUP: "Startup",
  WORK: "Work",
  PERSONAL: "Personal",
  SIDE_PROJECT: "Side Project",
  RESEARCH: "Research",
  OTHER: "Other",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
