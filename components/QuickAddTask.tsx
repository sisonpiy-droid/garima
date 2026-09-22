"use client";

import { useRef, useState, useTransition } from "react";
import { quickAddTask } from "@/lib/actions/tasks";

export function QuickAddTask() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="text-sm text-accent hover:underline"
      >
        + Add task
      </button>
    );
  }

  function submit() {
    const name = value.trim();
    if (!name) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await quickAddTask(name);
      setValue("");
    });
  }

  return (
    <input
      ref={inputRef}
      value={value}
      disabled={pending}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
        if (e.key === "Escape") {
          setOpen(false);
          setValue("");
        }
      }}
      onBlur={() => {
        submit();
        setOpen(false);
      }}
      placeholder="Task name, press Enter..."
      className="w-full rounded-lg border border-border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
    />
  );
}
