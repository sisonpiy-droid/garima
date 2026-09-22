"use client";

import { useTransition } from "react";
import type { Visibility } from "@prisma/client";

export function VisibilityToggle({
  visibility,
  onToggle,
}: {
  visibility: Visibility;
  onToggle: (next: Visibility) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const isPublic = visibility === "PUBLIC";

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => onToggle(isPublic ? "PRIVATE" : "PUBLIC"))}
      className={`rounded-full border px-2.5 py-0.5 text-xs ${
        isPublic
          ? "border-accent text-accent"
          : "border-border text-muted"
      }`}
    >
      {isPublic ? "Public" : "Private"}
    </button>
  );
}
