import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { HomeHero, HomeFeed } from "@/components/HomeFeed";

export default async function RootPage() {
  const [writings, ideas, thoughts] = await Promise.all([
    prisma.writing.findMany({ where: { visibility: "PUBLIC" }, orderBy: { publishedAt: "desc" }, take: 20 }),
    prisma.idea.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.thought.findMany({ where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  type Ranked = { date: number } & (
    | { type: "writing"; key: string; title: string; excerpt: string | null; href: string; dateLabel: string }
    | { type: "idea"; key: string; title: string; body: string | null; dateLabel: string }
    | { type: "thought"; key: string; body: string; dateLabel: string }
  );

  const posts: Ranked[] = [
    ...writings.map((w): Ranked => ({
      type: "writing",
      key: `w-${w.id}`,
      title: w.title,
      excerpt: w.excerpt,
      href: `/writing/${w.slug}`,
      dateLabel: formatDate(w.publishedAt),
      date: w.publishedAt?.getTime() ?? 0,
    })),
    ...ideas.map((i): Ranked => ({
      type: "idea",
      key: `i-${i.id}`,
      title: i.title,
      body: i.body,
      dateLabel: formatDate(i.createdAt),
      date: i.createdAt.getTime(),
    })),
    ...thoughts.map((t): Ranked => ({
      type: "thought",
      key: `t-${t.id}`,
      body: t.body,
      dateLabel: formatDate(t.createdAt),
      date: t.createdAt.getTime(),
    })),
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="flex flex-col gap-10">
      <HomeHero
        avatarLetter="G"
        heading="Hi, I'm Garima"
        emoji="👋"
        tagline={
          <>
            Welcome to inside my brain — writing, ideas, and things I&apos;m building, out in the open. See{" "}
            <Link href="/now" className="text-accent hover:underline">what I&apos;m working on right now</Link>.
          </>
        }
      />

      <HomeFeed posts={posts} />
    </div>
  );
}
