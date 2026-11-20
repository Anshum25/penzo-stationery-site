import Link from "next/link";
import { desc } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { db, posts } from "@/lib/db";
import { deletePost } from "@/lib/actions/admin";
import { readingMinutes } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageTitle } from "@/components/admin/page-title";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PostPublishSwitch } from "@/components/admin/post-publish-switch";

export default async function AdminJournalPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt)).all();
  return (
    <>
      <PageTitle title="Journal" description={`${rows.length} article${rows.length === 1 ? "" : "s"} · shown on the website journal and homepage.`}>
        <Link href="/admin/journal/new" className={buttonVariants({ size: "lg" })}>
          <Plus /> New article
        </Link>
      </PageTitle>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Article</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <span className="h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {p.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover.replace(/w=\d+/, "w=200")} alt="" className="size-full object-cover" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/admin/journal/${p.id}`} className="block max-w-xs truncate font-medium hover:underline">{p.title}</Link>
                      <p className="text-xs text-muted-foreground">{readingMinutes(p.body)} min read · {p.author}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{p.topic}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{p.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                <TableCell><PostPublishSwitch id={p.id} value={p.published} /></TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/journal/${p.id}`} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label={`Edit ${p.title}`}>
                      <Pencil />
                    </Link>
                    <ConfirmDelete label={`"${p.title}"`} onConfirm={deletePost.bind(null, p.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">No articles yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
