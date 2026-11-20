import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db, products } from "@/lib/db";
import { getCategories } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { PageTitle } from "@/components/admin/page-title";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const id = Number((await params).id);
  const product = Number.isInteger(id) ? await db.select().from(products).where(eq(products.id, id)).get() : undefined;
  if (!product) notFound();

  return (
    <>
      <PageTitle title="Edit product" description={product.name}>
        <Link href={`/products/${product.slug}`} target="_blank" className={buttonVariants({ variant: "outline" })}>
          <ExternalLink /> View on site
        </Link>
      </PageTitle>
      <ProductForm product={product} categories={await getCategories()} />
    </>
  );
}
