"use client";

import { useEffect, useState } from "react";

function computeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(computeGreeting());
  }, []);

  return (
    <h1 className="font-serif text-2xl font-semibold">
      {greeting ?? "Hello"}, {name} 👋
    </h1>
  );
}
