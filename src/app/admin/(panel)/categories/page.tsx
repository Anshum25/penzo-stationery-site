import { count, eq } from "drizzle-orm";
import { Pencil, Plus } from "lucide-react";
import { categories, db, products } from "@/lib/db";
import { deleteCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/admin/page-title";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Illustration } from "@/components/site/illustration";

export default async function CategoriesPage() {
  const rows = await db
    .select({ category: categories, productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.sortOrder)
    .all();

  return (
    <>
      <PageTitle title="Categories" description="These appear on the homepage and product filters.">
        <CategoryDialog trigger={<Button size="lg"><Plus /> New category</Button>} />
      </PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ category: c, productCount }) => (
          <Card key={c.id} className="overflow-hidden py-0">
            <div className="relative h-32" style={{ backgroundColor: c.accent }}>
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <Illustration kind={c.illustration} accent="#fffdf8" className="absolute right-2 -bottom-4 w-28" />
              )}
            </div>
            <CardContent className="flex items-start justify-between gap-2 py-4">
              <div className="min-w-0">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{productCount} products · /{c.slug}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              </div>
              <div className="flex shrink-0">
                <CategoryDialog category={c} trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${c.name}`}><Pencil /></Button>} />
                <ConfirmDelete label={c.name} onConfirm={deleteCategory.bind(null, c.id)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
