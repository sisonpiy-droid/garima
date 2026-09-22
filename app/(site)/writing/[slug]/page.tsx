import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writing = await prisma.writing.findUnique({
    where: { slug },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!writing || writing.visibility !== "PUBLIC") notFound();

  return (
    <article className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{writing.title}</h1>
        <p className="text-xs text-muted">
          <Link href={`/u/${writing.user.id}`} className="hover:text-accent">
            {writing.user.name || writing.user.email.split("@")[0]}
          </Link>{" "}
          · {formatDate(writing.publishedAt)}
        </p>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ReactMarkdown>{writing.body}</ReactMarkdown>
      </div>
    </article>
  );
}
