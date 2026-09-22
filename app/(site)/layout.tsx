import type { ReactNode } from "react";
import { PublicNav } from "@/components/PublicNav";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        Idea Revolver
      </footer>
    </>
  );
}
