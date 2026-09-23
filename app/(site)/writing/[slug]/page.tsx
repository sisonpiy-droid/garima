import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writing = await prisma.writing.findUnique({ where: { slug } });

  if (!writing || writing.visibility !== "PUBLIC") notFound();

  return (
    <article className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{writing.title}</h1>
        <p className="text-xs text-muted">{formatDate(writing.publishedAt)}</p>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ReactMarkdown>{writing.body}</ReactMarkdown>
      </div>
    </article>
  );
}
