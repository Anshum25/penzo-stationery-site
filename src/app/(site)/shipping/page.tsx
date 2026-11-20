import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping & returns"
      updated="November 2026"
      sections={[
        { heading: "Dispatch times", body: ["In-stock orders are packed and dispatched within 48 hours on working days.", "Custom-branded and bulk orders follow the timeline confirmed in your quote, typically 7–21 working days."] },
        { heading: "Delivery", body: ["We deliver to all serviceable pin codes in India through trusted courier partners. Most orders arrive within 3–7 working days.", "A tracking link is shared by email and SMS as soon as your order ships."] },
        { heading: "Shipping charges", body: ["Shipping is free on orders above ₹999. A flat fee applies to smaller orders and is shown before you confirm.", "Bulk shipments are quoted separately based on weight and destination."] },
        { heading: "Returns", body: ["Unused products in their original packaging can be returned within 7 days of delivery.", "Custom-branded or personalised items cannot be returned unless they arrive damaged or defective."] },
        { heading: "Damaged or incorrect items", body: ["If something arrives damaged or isn't what you ordered, contact us within 48 hours with photos and we'll arrange a free replacement or refund."] },
        { heading: "Refunds", body: ["Approved refunds are processed to the original payment method within 5–7 working days of us receiving the returned item."] },
      ]}
    />
  );
}
