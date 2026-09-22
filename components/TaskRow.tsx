"use client";

import { useTransition } from "react";
import { setTaskStatus, deleteTask } from "@/lib/actions/tasks";
import type { Task } from "@prisma/client";

export function TaskRow({ task, showProject }: { task: Task & { project?: { name: string } | null }; showProject?: boolean }) {
  const [pending, startTransition] = useTransition();
  const done = task.status === "COMPLETED";

  return (
    <div className="group flex items-center gap-3 py-1.5">
      <button
        aria-label={done ? "Mark as to do" : "Mark as completed"}
        disabled={pending}
        onClick={() =>
          startTransition(() => setTaskStatus(task.id, done ? "TODO" : "COMPLETED"))
        }
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
          done ? "border-accent bg-accent text-white" : "border-border"
        }`}
      >
        {done ? "✓" : ""}
      </button>
      <span className={`flex-1 text-sm ${done ? "text-muted line-through" : ""}`}>
        {task.name}
        {showProject && task.project && (
          <span className="ml-2 text-xs text-muted">· {task.project.name}</span>
        )}
      </span>
      <button
        aria-label="Delete task"
        disabled={pending}
        onClick={() => startTransition(() => deleteTask(task.id))}
        className="text-xs text-muted opacity-0 hover:text-red-600 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
