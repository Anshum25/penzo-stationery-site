"use client";

import { saveCategory } from "@/lib/actions/admin";
import { illustrations, type Category } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "./form-dialog";

export function CategoryDialog({ category, trigger }: { category?: Category; trigger: React.ReactElement }) {
  return (
    <FormDialog
      title={category ? "Edit category" : "New category"}
      trigger={trigger}
      action={saveCategory.bind(null, category?.id ?? null)}
    >
      {(errors) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" name="name" defaultValue={category?.name} required />
            {errors?.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea id="c-desc" name="description" rows={3} defaultValue={category?.description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-image">Cover photo</Label>
            <Input id="c-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
            <p className="text-xs text-muted-foreground">{category?.image ? "Leave empty to keep the current photo." : "Optional — shown on the homepage category grid."}</p>
            {errors?.image && <p className="text-sm text-destructive">{errors.image[0]}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="c-ill">Illustration</Label>
              <select
                id="c-ill"
                name="illustration"
                defaultValue={category?.illustration ?? "notebook"}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm capitalize"
              >
                {illustrations.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-accent">Colour</Label>
              <Input id="c-accent" name="accent" type="color" defaultValue={category?.accent ?? "#e4572e"} className="p-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-sort">Order</Label>
              <Input id="c-sort" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
            </div>
          </div>
        </>
      )}
    </FormDialog>
  );
}
