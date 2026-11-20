import { PageHeader } from "./page-header";
import { site } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

/** Shared layout for policy pages. The copy is a starting template — have the client's legal advisor review it. */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHeader eyebrow="Policies" title={title} description={`Last updated ${updated}`} crumbs={[{ label: title }]} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-28 md:px-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-32 space-y-2 text-sm">
            <p className="mb-3 font-semibold">On this page</p>
            {sections.map((s, i) => (
              <a key={s.heading} href={`#s${i}`} className="block text-muted-foreground hover:text-ink">{s.heading}</a>
            ))}
          </div>
        </nav>
        <article className="max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <section key={s.heading} id={`s${i}`} className="scroll-mt-28">
              <h2 className="font-display text-2xl font-semibold">{i + 1}. {s.heading}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </section>
          ))}
          <p className="border-t border-ink/10 pt-8 text-sm text-muted-foreground">
            Questions about this policy? Write to <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">{site.email}</a>.
          </p>
        </article>
      </section>
    </>
  );
}
