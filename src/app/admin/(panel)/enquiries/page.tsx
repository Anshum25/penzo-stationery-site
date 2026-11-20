import Link from "next/link";
import { and, desc, eq, like, or } from "drizzle-orm";
import { Building2, Phone } from "lucide-react";
import { db, enquiries } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageTitle } from "@/components/admin/page-title";
import { EnquiryActions } from "@/components/admin/enquiry-actions";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/admin/filter-bar";

const filters = ["all", "new", "read", "replied"] as const;

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const status = filters.find((f) => f === sp.status) ?? "all";
  const q = typeof sp.q === "string" && sp.q.trim() ? sp.q.trim() : undefined;
  const type = sp.type === "bulk" || sp.type === "general" ? sp.type : "";
  const term = q ? `%${q}%` : "";
  const rows = db
    .select()
    .from(enquiries)
    .where(
      and(
        status === "all" ? undefined : eq(enquiries.status, status),
        type ? eq(enquiries.type, type) : undefined,
        q ? or(like(enquiries.name, term), like(enquiries.email, term), like(enquiries.company, term), like(enquiries.message, term)) : undefined,
      ),
    )
    .orderBy(desc(enquiries.createdAt))
    .all();

  return (
    <>
      <PageTitle title="Enquiries" description={`${rows.length} message${rows.length === 1 ? "" : "s"} from the website forms.`} />
      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-muted p-1">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
            className={cn("rounded-md px-3 py-1.5 text-sm capitalize", status === f ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {f}
          </Link>
        ))}
      </div>
      <FilterBar
        q={q}
        placeholder="Search name, email, company or message…"
        keep={status === "all" ? {} : { status }}
        selects={[{ name: "type", value: type, options: [{ value: "", label: "All types" }, { value: "bulk", label: "Bulk orders" }, { value: "general", label: "General" }] }]}
      />
      <div className="space-y-3">
        {rows.length === 0 && <p className="py-16 text-center text-muted-foreground">No enquiries here yet.</p>}
        {rows.map((e) => (
          <Card key={e.id} className={cn(e.status === "new" && "ring-2 ring-vermilion/30")}>
            <CardContent className="space-y-3">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{e.name}</p>
                    <Badge variant={e.status === "new" ? "default" : "secondary"} className="capitalize">{e.status}</Badge>
                    {e.type === "bulk" && <Badge variant="outline">Bulk order</Badge>}
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a href={`mailto:${e.email}`} className="hover:underline">{e.email}</a>
                    {e.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{e.phone}</span>}
                    {e.company && <span className="flex items-center gap-1"><Building2 className="size-3" />{e.company}</span>}
                    <span>{e.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </p>
                </div>
                <EnquiryActions enquiry={e} />
              </div>
              <p className="whitespace-pre-wrap rounded-lg bg-muted/60 p-3 text-sm">{e.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
