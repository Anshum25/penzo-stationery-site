import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db, posts } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { PageTitle } from "@/components/admin/page-title";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({ params }: PageProps<"/admin/journal/[id]">) {
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? await db.select().from(posts).where(eq(posts.id, id)).get() : undefined;
  if (!post) notFound();
  const topics = [...new Set((await db.select({ t: posts.topic }).from(posts).all()).map((r) => r.t))];
  return (
    <>
      <PageTitle title="Edit article" description={post.title}>
        {post.published && (
          <Link href={`/journal/${post.slug}`} target="_blank" className={buttonVariants({ variant: "outline" })}>
            <ExternalLink /> View on site
          </Link>
        )}
      </PageTitle>
      <PostForm post={post} topics={topics} />
    </>
  );
}
