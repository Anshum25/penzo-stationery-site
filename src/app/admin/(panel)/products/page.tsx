import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { getCategories, getProducts } from "@/lib/queries";
import { FilterBar } from "@/components/admin/filter-bar";
import { deleteProduct } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageTitle } from "@/components/admin/page-title";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { FlagSwitch } from "@/components/admin/flag-switch";
import { ProductVisual } from "@/components/site/product-visual";

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" && sp.category ? sp.category : undefined;
  const stock = sp.stock === "in" || sp.stock === "out" ? sp.stock : "";
  const categories = await getCategories();
  const all = await getProducts({ q, category });
  const products = stock ? all.filter((p) => p.inStock === (stock === "in")) : all;

  return (
    <>
      <PageTitle title="Products" description={`${products.length} product${products.length === 1 ? "" : "s"} shown.`}>
        <Link href="/admin/products/new" className={buttonVariants({ size: "lg" })}>
          <Plus /> New product
        </Link>
      </PageTitle>

      <FilterBar
        q={q}
        selects={[
          { name: "category", value: category ?? "", options: [{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))] },
          { name: "stock", value: stock, options: [{ value: "", label: "Any stock" }, { value: "in", label: "In stock" }, { value: "out", label: "Out of stock" }] },
        ]}
      />
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>In stock</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <ProductVisual image={p.image} name={p.name} illustration={p.illustration} accent={p.accent} className="size-11 shrink-0 rounded-lg" artClassName="w-4/5" />
                    <div>
                      <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.categoryName ?? "—"}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell><FlagSwitch id={p.id} flag="featured" value={p.featured} label="Featured" /></TableCell>
                <TableCell><FlagSwitch id={p.id} flag="inStock" value={p.inStock} label="In stock" /></TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/products/${p.id}`} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label={`Edit ${p.name}`}>
                      <Pencil />
                    </Link>
                    <ConfirmDelete label={p.name} onConfirm={deleteProduct.bind(null, p.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No products found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
