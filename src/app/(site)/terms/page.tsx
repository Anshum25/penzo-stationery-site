import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="November 2026"
      sections={[
        { heading: "About these terms", body: ["These terms apply to your use of this website and to orders placed with us. By using the site you agree to them."] },
        { heading: "Products and pricing", body: ["We make every effort to show products and prices accurately. Prices are in Indian Rupees and may change without notice; the price confirmed in your order or quote applies.", "Product colours may vary slightly from photographs."] },
        { heading: "Quotes and bulk orders", body: ["Bulk quotes are valid for 30 days. Production of custom-branded orders begins only after written approval of the mock-up and receipt of any agreed advance."] },
        { heading: "Intellectual property", body: ["All content on this website, including text, images and logos, belongs to us or our licensors and may not be reused without permission.", "By submitting artwork for branding, you confirm you have the right to use it."] },
        { heading: "Limitation of liability", body: ["To the extent permitted by law, our liability for any order is limited to the amount paid for that order."] },
        { heading: "Governing law", body: ["These terms are governed by the laws of India, and disputes are subject to the courts of Ahmedabad, Gujarat."] },
      ]}
    />
  );
}
