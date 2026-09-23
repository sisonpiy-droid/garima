import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

type Post =
  | { type: "writing"; id: string; title: string; excerpt: string | null; slug: string; date: Date | null }
  | { type: "idea"; id: string; title: string; body: string | null; date: Date }
  | { type: "thought"; id: string; body: string; date: Date };

export default async function RootPage() {
  const [writings, ideas, thoughts] = await Promise.all([
    prisma.writing.findMany({ where: { visibility: "PUBLIC" }, orderBy: { publishedAt: "desc" }, take: 20 }),
    prisma.idea.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.thought.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const posts: Post[] = [
    ...writings.map((w): Post => ({ type: "writing", id: w.id, title: w.title, excerpt: w.excerpt, slug: w.slug, date: w.publishedAt })),
    ...ideas.map((i): Post => ({ type: "idea", id: i.id, title: i.title, body: i.body, date: i.createdAt })),
    ...thoughts.map((t): Post => ({ type: "thought", id: t.id, body: t.body, date: t.createdAt })),
  ].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-xl text-white">
          G
        </div>
        <div>
          <h1 className="font-serif text-3xl font-semibold">Hi, I&apos;m Garima 👋</h1>
          <p className="mt-1 text-muted">
            Welcome to inside my brain — writing, ideas, and things I&apos;m building, out in the open. See{" "}
            <Link href="/now" className="text-accent hover:underline">what I&apos;m working on right now</Link>.
          </p>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {posts.length === 0 && <p className="text-sm text-muted">Nothing published yet — check back soon.</p>}
        {posts.map((post) => {
          if (post.type === "writing") {
            return (
              <Link key={`w-${post.id}`} href={`/writing/${post.slug}`} className="group py-5">
                <p className="font-serif text-xl font-semibold group-hover:text-accent">{post.title}</p>
                {post.excerpt && <p className="mt-1 text-muted">{post.excerpt}</p>}
                <p className="mt-2 text-xs text-muted">Writing · {formatDate(post.date)}</p>
              </Link>
            );
          }
          if (post.type === "idea") {
            return (
              <div key={`i-${post.id}`} className="py-5">
                <p className="font-medium">{post.title}</p>
                {post.body && <p className="mt-1 text-muted">{post.body}</p>}
                <p className="mt-2 text-xs text-muted">Idea · {formatDate(post.date)}</p>
              </div>
            );
          }
          return (
            <div key={`t-${post.id}`} className="py-5">
              <p>{post.body}</p>
              <p className="mt-2 text-xs text-muted">Thought · {formatDate(post.date)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
