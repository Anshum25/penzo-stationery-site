"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ImagePlus, Loader2, X } from "lucide-react";
import { saveProduct } from "@/lib/actions/admin";
import type { FormState } from "@/lib/actions/types";
import type { Category, Product } from "@/lib/db/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function Err({ e }: { e?: string[] }) {
  return e ? <p className="text-sm text-destructive">{e[0]}</p> : null;
}

function Toggle({ name, label, hint, defaultChecked }: { name: string; label: string; hint: string; defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={on} onCheckedChange={setOn} />
      {on && <input type="hidden" name={name} value="on" />}
    </label>
  );
}

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct.bind(null, product?.id ?? null), {});
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);
  const [removed, setRemoved] = useState(false);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
            <Err e={state.errors?.name} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" name="price" type="number" min="0" step="1" defaultValue={product?.price} required />
              <Err e={state.errors?.price} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product?.categoryId ?? ""}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="auto from name" />
              <Err e={state.errors?.slug} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={6} defaultValue={product?.description} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Image</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed text-sm text-muted-foreground hover:border-ring">
              {preview && !removed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <>
                  <ImagePlus className="size-8" />
                  Click to upload
                  <span className="text-xs">JPG, PNG, WEBP · max 5 MB</span>
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
            <p className="text-xs text-muted-foreground">Without a photo, the website shows the category illustration.</p>
            <Err e={state.errors?.image} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Visibility</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Toggle name="featured" label="Featured" hint="Show in homepage bestsellers" defaultChecked={product?.featured ?? false} />
            <Toggle name="inStock" label="In stock" hint="Available to order" defaultChecked={product?.inStock ?? true} />
          </CardContent>
        </Card>
        {state.message && <p className="text-sm text-destructive">{state.message}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="lg" disabled={pending} className="flex-1">
            {pending && <Loader2 className="animate-spin" />} {product ? "Save changes" : "Create product"}
          </Button>
          <Link href="/admin/products" className={buttonVariants({ variant: "outline", size: "lg" })}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
