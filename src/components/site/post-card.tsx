import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/db/schema";
import { readingMinutes } from "@/lib/queries";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function formatPostDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function PostCard({ post, index = 0, large }: { post: Post; index?: number; large?: boolean }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link href={`/journal/${post.slug}`} className={cn("group block", large && "lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12")}>
        <div className={cn("zoom-img relative overflow-hidden rounded-3xl bg-muted", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" loading="lazy" className="size-full object-cover" />
          )}
          <span className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold backdrop-blur">{post.topic}</span>
        </div>
        <div className={cn("mt-5", large && "lg:mt-0")}>
          <p className="text-sm text-muted-foreground">
            {formatPostDate(post.createdAt)} · {readingMinutes(post.body)} min read
          </p>
          <h3 className={cn("mt-2 font-display font-semibold leading-tight", large ? "text-3xl md:text-5xl" : "text-2xl")}>
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
              {post.title}
            </span>
          </h3>
          <p className={cn("mt-3 text-muted-foreground", large && "text-lg")}>{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
            Read article <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
