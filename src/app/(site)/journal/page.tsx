import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { CtaBand } from "@/components/site/cta-band";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides, ideas and stories about writing, paper and better workspaces.",
};

export default async function JournalPage({ searchParams }: PageProps<"/journal">) {
  const sp = await searchParams;
  const all = await getPosts();
  const topics = [...new Set(all.map((p) => p.topic))];
  const topic = typeof sp.topic === "string" && topics.includes(sp.topic) ? sp.topic : undefined;
  const posts = topic ? all.filter((p) => p.topic === topic) : all;
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="The Penzo Journal"
        title="Notes on paper, pens and doing good work."
        description="Practical guides, product know-how and ideas for better workspaces — written by the people who test every notebook we make."
        crumbs={[{ label: "Journal" }]}
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="mb-12 flex flex-wrap gap-2">
          {[undefined, ...topics].map((t) => (
            <Link
              key={t ?? "all"}
              href={t ? `/journal?topic=${encodeURIComponent(t)}` : "/journal"}
              scroll={false}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                topic === t ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/50",
              )}
            >
              {t ?? "All articles"}
            </Link>
          ))}
        </div>
        {lead ? (
          <>
            <PostCard post={lead} large />
            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-8 gap-y-16 border-t border-ink/10 pt-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
              </div>
            )}
          </>
        ) : (
          <p className="py-24 text-center text-muted-foreground">No articles yet — check back soon.</p>
        )}
      </section>
      <CtaBand title="Have a question about paper or pens?" text="Our team is happy to help you pick the right products — for yourself or your whole organisation." primary={{ label: "Ask our team", href: "/contact" }} />
    </>
  );
}
