import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getPostBySlug, getPosts, getProducts, readingMinutes } from "@/lib/queries";
import { ArticleBody, articleHeadings } from "@/components/site/article-body";
import { ReadingProgress } from "@/components/site/reading-progress";
import { PostCard, formatPostDate } from "@/components/site/post-card";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, SplitReveal } from "@/components/motion/reveal";
import { LogoTile } from "@/components/brand/logo";

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: post.cover ? { images: [post.cover] } : undefined } : {};
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  const headings = articleHeadings(post.body);
  const more = getPosts().filter((p) => p.id !== post.id).slice(0, 3);
  const products = getProducts({ featured: true }).slice(0, 4);

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="mx-auto max-w-4xl px-4 pt-32 text-center md:px-8 md:pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-ink">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/journal" className="hover:text-ink">Journal</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-ink">{post.topic}</span>
          </nav>
          <SplitReveal as="h1" animateOnMount text={post.title} className="font-display text-4xl leading-[1.05] font-semibold md:text-6xl" />
          <Reveal delay={0.2} y={12}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm">
              <LogoTile className="size-9" />
              <span className="text-left">
                <span className="block font-medium">{post.author}</span>
                <span className="block text-muted-foreground">
                  {formatPostDate(post.createdAt)} · {readingMinutes(post.body)} min read
                </span>
              </span>
            </div>
          </Reveal>
        </header>

        {post.cover && (
          <Reveal delay={0.25} y={40} className="mx-auto mt-14 max-w-6xl px-4 md:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" className="aspect-[16/8] w-full rounded-[2rem] object-cover" />
          </Reveal>
        )}

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:px-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-6">
              {headings.length > 0 && (
                <nav aria-label="In this article">
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">In this article</p>
                  <ul className="space-y-2 border-l border-ink/10 text-sm">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-ink hover:text-ink">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <Link href="/journal" className="flex items-center gap-2 text-sm font-medium hover:underline">
                <ArrowLeft className="size-4" /> All articles
              </Link>
            </div>
          </aside>
          <div className="max-w-2xl">
            <ArticleBody body={post.body} />
            <div className="mt-14 rounded-3xl bg-ink p-8 text-paper">
              <p className="font-display text-2xl font-semibold">Need help choosing?</p>
              <p className="mt-2 text-paper/70">Tell us what you write with and how — we&apos;ll recommend the right paper and pens.</p>
              <Link href="/contact" className="mt-6 inline-flex rounded-full bg-mustard px-6 py-3 text-sm font-semibold text-ink hover:bg-paper">
                Ask our team
              </Link>
            </div>
          </div>
        </div>
      </article>

      {products.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-ink/10 px-4 py-20 md:px-8">
          <h2 className="mb-10 font-display text-3xl font-semibold md:text-4xl">Shop the essentials</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <h2 className="mb-10 font-display text-3xl font-semibold md:text-4xl">Keep reading</h2>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </div>
        </section>
      )}
    </>
  );
}
