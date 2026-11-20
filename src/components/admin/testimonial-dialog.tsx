"use client";

import { useState } from "react";
import { saveTestimonial } from "@/lib/actions/admin";
import type { Testimonial } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "./form-dialog";

function Published({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <label className="flex items-center gap-3 text-sm">
      <Switch checked={on} onCheckedChange={setOn} /> Show on website
      {on && <input type="hidden" name="published" value="on" />}
    </label>
  );
}

export function TestimonialDialog({ testimonial, trigger }: { testimonial?: Testimonial; trigger: React.ReactElement }) {
  return (
    <FormDialog
      title={testimonial ? "Edit testimonial" : "New testimonial"}
      trigger={trigger}
      action={saveTestimonial.bind(null, testimonial?.id ?? null)}
    >
      {(errors) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t-name">Name</Label>
              <Input id="t-name" name="name" defaultValue={testimonial?.name} required />
              {errors?.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-role">Role / company</Label>
              <Input id="t-role" name="role" defaultValue={testimonial?.role} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-quote">Quote</Label>
            <Textarea id="t-quote" name="quote" rows={4} defaultValue={testimonial?.quote} required />
            {errors?.quote && <p className="text-sm text-destructive">{errors.quote[0]}</p>}
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="t-rating">Rating</Label>
              <Input id="t-rating" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} className="w-20" />
            </div>
            <Published initial={testimonial?.published ?? true} />
          </div>
        </>
      )}
    </FormDialog>
  );
}
