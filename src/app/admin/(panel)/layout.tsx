import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db, enquiries } from "@/lib/db";
import { Sidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const [{ value: newEnquiries }] = await db.select({ value: count() }).from(enquiries).where(eq(enquiries.status, "new")).all();

  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar user={user} newEnquiries={newEnquiries} />
      <div className="lg:pl-60">
        <main className="mx-auto max-w-6xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
