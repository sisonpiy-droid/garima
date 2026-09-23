"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.killTweensOf(ref.current);
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "opacity,transform" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}

type Post =
  | { type: "writing"; key: string; title: string; excerpt: string | null; href: string; dateLabel: string }
  | { type: "idea"; key: string; title: string; body: string | null; dateLabel: string }
  | { type: "thought"; key: string; body: string; dateLabel: string };

export function HomeFeed({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-feed-item]"));

    const triggers = items.map((item) => {
      gsap.killTweensOf(item);
      return gsap.fromTo(
        item,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: item, start: "top 92%", once: true },
        }
      ).scrollTrigger;
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, [posts]);

  if (posts.length === 0) {
    return <p className="text-sm text-muted">Nothing published yet — check back soon.</p>;
  }

  return (
    <div ref={containerRef} className="flex flex-col divide-y divide-border">
      {posts.map((post) => {
        if (post.type === "writing") {
          return (
            <Link key={post.key} href={post.href} data-feed-item className="group py-5">
              <p className="font-serif text-xl font-semibold group-hover:text-accent">{post.title}</p>
              {post.excerpt && <p className="mt-1 text-muted">{post.excerpt}</p>}
              <p className="mt-2 text-xs text-muted">Writing &middot; {post.dateLabel}</p>
            </Link>
          );
        }
        if (post.type === "idea") {
          return (
            <div key={post.key} data-feed-item className="py-5">
              <p className="font-medium">{post.title}</p>
              {post.body && <p className="mt-1 text-muted">{post.body}</p>}
              <p className="mt-2 text-xs text-muted">Idea &middot; {post.dateLabel}</p>
            </div>
          );
        }
        return (
          <div key={post.key} data-feed-item className="py-5">
            <p>{post.body}</p>
            <p className="mt-2 text-xs text-muted">Thought &middot; {post.dateLabel}</p>
          </div>
        );
      })}
    </div>
  );
}
