import { getCategories } from "@/lib/queries";
import { PageTitle } from "@/components/admin/page-title";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  return (
    <>
      <PageTitle title="New product" description="Add an item to your catalogue." />
      <ProductForm categories={await getCategories()} />
    </>
  );
}
