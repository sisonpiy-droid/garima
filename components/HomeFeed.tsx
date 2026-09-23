"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeHero({
  avatarLetter,
  heading,
  emoji,
  tagline,
}: {
  avatarLetter: string;
  heading: string;
  emoji?: string;
  tagline: ReactNode;
}) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!avatarRef.current || !headingRef.current || !taglineRef.current) return;

    const words = Array.from(headingRef.current.querySelectorAll<HTMLElement>("[data-word]"));
    const targets = [avatarRef.current, ...words, taglineRef.current];
    gsap.killTweensOf(targets);

    const tl = gsap.timeline();
    tl.fromTo(
      avatarRef.current,
      { opacity: 0, scale: 0.6, rotate: -8 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)", clearProps: "all" }
    )
      .fromTo(
        words,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.04,
          clearProps: "opacity,transform",
        },
        "-=0.3"
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "opacity,transform" },
        "-=0.15"
      );

    return () => {
      tl.kill();
    };
  }, [heading]);

  const words = heading.split(" ");

  return (
    <div className="flex items-center gap-4">
      <div
        ref={avatarRef}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-xl text-accent-ink"
      >
        {avatarLetter}
      </div>
      <div>
        <h1 ref={headingRef} className="font-serif text-3xl font-semibold">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className="inline-block">
                {word}
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
          {emoji && (
            <>
              {" "}
              <span className="animate-wave">{emoji}</span>
            </>
          )}
        </h1>
        <p ref={taglineRef} className="mt-1 text-muted">
          {tagline}
        </p>
      </div>
    </div>
  );
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
            <Link
              key={post.key}
              href={post.href}
              data-feed-item
              className="group py-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
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
