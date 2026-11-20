import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getProductBySlug } from "@/lib/queries";
import { generalFaqs } from "@/lib/content";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { SectionHeading } from "@/components/site/section-heading";
import { Faq } from "@/components/site/faq";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const type = sp.type === "bulk" ? "bulk" : "general";
  const product = typeof sp.product === "string" ? getProductBySlug(sp.product) : undefined;
  const defaultMessage = product ? `Hi! I'm interested in "${product.name}" (${product.sku}). Quantity: ` : undefined;

  const contacts = [
    { icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: "Call us", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with sales", href: site.socials.whatsapp },
    { icon: Clock, label: "Business hours", value: site.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about what you need."
        description="Questions about a product, a bulk order or custom branding? Our team replies within one business day."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                className="group flex h-full flex-col gap-6 rounded-3xl border border-ink/10 bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_24px_50px_-30px_rgba(21,20,19,.4)]"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-ink text-paper transition-colors group-hover:bg-vermilion">
                  <c.icon className="size-5" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">{c.label}</span>
                  <span className="mt-1 block font-medium">{c.value}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-[2rem] border border-ink/10 bg-card p-6 md:p-12">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Send us a message</h2>
          <p className="mt-2 mb-10 text-muted-foreground">Fill in the form and the right person from our team will get back to you.</p>
          <ContactForm defaultType={type} defaultMessage={defaultMessage} />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4">
          <div className="relative min-h-80 flex-1 overflow-hidden rounded-[2rem] border border-ink/10 bg-muted">
            <iframe title="Studio location map" src={site.mapEmbed} className="absolute inset-0 size-full grayscale-[60%]" loading="lazy" />
          </div>
          <div className="flex items-start gap-4 rounded-3xl bg-ink p-6 text-paper">
            <MapPin className="mt-0.5 size-5 shrink-0 text-mustard" />
            <div>
              <p className="font-medium">Visit our studio</p>
              <p className="mt-1 text-sm text-paper/70">{site.address}</p>
              <p className="mt-1 text-sm text-paper/70">{site.hours}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-28 md:px-8 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading eyebrow="FAQ" title="Answers to common questions." />
        <Faq items={generalFaqs} />
      </section>
    </>
  );
}
