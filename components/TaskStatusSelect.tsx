"use client";

import { useTransition } from "react";
import { setTaskStatus } from "@/lib/actions/tasks";
import { TASK_STATUS_LABELS } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";

export function TaskStatusSelect({ id, status }: { id: string; status: TaskStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => setTaskStatus(id, e.target.value as TaskStatus))}
      className="rounded-md border border-border bg-background px-1.5 py-0.5 text-xs"
    >
      {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
