import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="November 2026"
      sections={[
        { heading: "Information we collect", body: ["When you contact us or request a quote, we collect the details you provide: name, email, phone number, company and your message.", "We also collect basic, anonymous usage data such as pages visited, to improve the website."] },
        { heading: "How we use it", body: ["We use your information only to respond to enquiries, prepare quotes, fulfil orders and provide customer support.", "We do not sell or rent your personal information to anyone."] },
        { heading: "Sharing", body: ["We share information only with service providers who help us operate — for example courier partners for delivery — and only as much as they need."] },
        { heading: "Data retention", body: ["Enquiry records are kept for as long as needed to serve you and meet legal obligations, after which they are deleted."] },
        { heading: "Your rights", body: ["You can ask us to access, correct or delete the personal information we hold about you at any time by emailing us."] },
        { heading: "Cookies", body: ["This website uses only essential cookies needed for it to function. We do not use advertising cookies."] },
      ]}
    />
  );
}
