"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ImagePlus, Loader2, X } from "lucide-react";
import { savePost } from "@/lib/actions/admin";
import type { FormState } from "@/lib/actions/types";
import type { Post } from "@/lib/db/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function Err({ e }: { e?: string[] }) {
  return e ? <p className="text-sm text-destructive">{e[0]}</p> : null;
}

export function PostForm({ post, topics }: { post?: Post; topics: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost.bind(null, post?.id ?? null), {});
  const [preview, setPreview] = useState<string | null>(post?.cover ?? null);
  const [removed, setRemoved] = useState(false);
  const [published, setPublished] = useState(post?.published ?? true);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader><CardTitle>Article</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={post?.title} required className="h-10 text-base" />
            <Err e={state.errors?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Summary</Label>
            <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} placeholder="One or two sentences shown on article cards" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" name="body" rows={18} defaultValue={post?.body} className="font-mono text-sm leading-relaxed" />
            <p className="text-xs text-muted-foreground">
              Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading and <code>- </code> for a list item.
            </p>
            <Err e={state.errors?.body} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Cover image</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:border-ring">
              {preview && !removed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <>
                  <ImagePlus className="size-8" />
                  Click to upload
                </>
              )}
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPreview(URL.createObjectURL(f));
                    setRemoved(false);
                  }
                }}
              />
            </label>
            {preview && !removed && (
              <Button type="button" variant="outline" size="sm" onClick={() => setRemoved(true)}>
                <X /> Remove image
              </Button>
            )}
            {removed && <input type="hidden" name="removeImage" value="on" />}
            <Err e={state.errors?.image} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" list="topics" defaultValue={post?.topic ?? "Guides"} required />
              <datalist id="topics">{topics.map((t) => <option key={t} value={t} />)}</datalist>
              <Err e={state.errors?.topic} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" defaultValue={post?.author ?? "Penzo Team"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="auto from title" />
              <Err e={state.errors?.slug} />
            </div>
            <label className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <span>
                <span className="block text-sm font-medium">Published</span>
                <span className="block text-xs text-muted-foreground">Visible on the website</span>
              </span>
              <Switch checked={published} onCheckedChange={setPublished} />
              {published && <input type="hidden" name="published" value="on" />}
            </label>
          </CardContent>
        </Card>
        {state.message && <p className="text-sm text-destructive">{state.message}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="lg" disabled={pending} className="flex-1">
            {pending && <Loader2 className="animate-spin" />} {post ? "Save changes" : "Publish article"}
          </Button>
          <Link href="/admin/journal" className={buttonVariants({ variant: "outline", size: "lg" })}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
