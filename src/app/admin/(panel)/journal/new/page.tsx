import { db, posts } from "@/lib/db";
import { PageTitle } from "@/components/admin/page-title";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  const topics = [...new Set((await db.select({ t: posts.topic }).from(posts).all()).map((r) => r.t))];
  return (
    <>
      <PageTitle title="New article" description="Write a guide, story or announcement for the journal." />
      <PostForm topics={topics} />
    </>
  );
}
