import { Pencil, Plus, Star } from "lucide-react";
import { db, testimonials } from "@/lib/db";
import { deleteTestimonial } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/admin/page-title";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { TestimonialDialog } from "@/components/admin/testimonial-dialog";

export default async function TestimonialsPage() {
  const rows = await db.select().from(testimonials).all();
  return (
    <>
      <PageTitle title="Testimonials" description="Customer quotes shown in the homepage card stack.">
        <TestimonialDialog trigger={<Button size="lg"><Plus /> New testimonial</Button>} />
      </PageTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((t) => (
          <Card key={t.id}>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-0.5 text-vermilion">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <div className="flex items-center gap-1">
                  {!t.published && <Badge variant="secondary">Hidden</Badge>}
                  <TestimonialDialog testimonial={t} trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${t.name}`}><Pencil /></Button>} />
                  <ConfirmDelete label={`testimonial from ${t.name}`} onConfirm={deleteTestimonial.bind(null, t.id)} />
                </div>
              </div>
              <p className="font-display text-lg leading-snug">“{t.quote}”</p>
              <p className="text-sm"><span className="font-medium">{t.name}</span> <span className="text-muted-foreground">· {t.role}</span></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
