"use client";

import { useTransition } from "react";
import { Mail } from "lucide-react";
import { deleteEnquiry, setEnquiryStatus } from "@/lib/actions/admin";
import type { Enquiry } from "@/lib/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDelete } from "./confirm-delete";

export function EnquiryActions({ enquiry }: { enquiry: Enquiry }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <select
        aria-label="Status"
        disabled={pending}
        defaultValue={enquiry.status}
        onChange={(e) => start(() => setEnquiryStatus(enquiry.id, e.target.value as Enquiry["status"]))}
        className="h-8 rounded-lg border bg-background px-2 text-sm"
      >
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
      </select>
      <a
        href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Re: your enquiry")}`}
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        aria-label="Reply by email"
        onClick={() => enquiry.status !== "replied" && start(() => setEnquiryStatus(enquiry.id, "replied"))}
      >
        <Mail />
      </a>
      <ConfirmDelete label={`enquiry from ${enquiry.name}`} onConfirm={deleteEnquiry.bind(null, enquiry.id)} />
    </div>
  );
}
