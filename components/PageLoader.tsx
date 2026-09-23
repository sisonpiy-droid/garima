"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotsRef.current || !overlayRef.current) return;
    const dots = Array.from(dotsRef.current.querySelectorAll<HTMLElement>("[data-dot]"));

    const tl = gsap.timeline({ repeat: -1 });
    dots.forEach((dot, i) => {
      tl.to(dot, { y: -10, duration: 0.25, ease: "power1.out" }, i * 0.12).to(
        dot,
        { y: 0, duration: 0.25, ease: "power1.in" },
        i * 0.12 + 0.25
      );
    });

    const hideTimer = setTimeout(() => {
      tl.kill();
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => setVisible(false),
      });
    }, 650);

    return () => {
      clearTimeout(hideTimer);
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div ref={dotsRef} className="flex gap-2">
        <span data-dot className="h-3 w-3 rounded-full bg-accent" />
        <span data-dot className="h-3 w-3 rounded-full bg-accent" />
        <span data-dot className="h-3 w-3 rounded-full bg-accent" />
      </div>
    </div>
  );
}
