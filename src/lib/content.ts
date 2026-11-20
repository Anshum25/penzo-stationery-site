// Marketing copy for the inner pages. Placeholder facts — confirm every figure and claim with the client.
import type { FaqItem } from "@/components/site/faq";

export const values = [
  { title: "Made to last", text: "Lay-flat bindings, 100 GSM paper and metal parts that survive years of daily use." },
  { title: "Responsibly sourced", text: "FSC-certified paper, soy-based inks and plastic-free packaging wherever possible." },
  { title: "Reliable at scale", text: "From one notebook to 10,000 welcome kits — the same quality, delivered on schedule." },
  { title: "People first", text: "A named account manager for every business client and real humans on every reply." },
];

export const timeline = [
  { year: "2012", title: "A stall in Ahmedabad", text: "Penzo starts as a weekend stationery stall with 40 hand-picked products." },
  { year: "2015", title: "Our first notebook line", text: "We design our own journals after struggling to find paper good enough for fountain pens." },
  { year: "2018", title: "Corporate gifting", text: "Our first 500-kit order for a fintech launch turns into a dedicated B2B division." },
  { year: "2021", title: "In-house studio", text: "A 12,000 sq ft facility for printing, embossing and quality control under one roof." },
  { year: "2024", title: "350+ business clients", text: "Schools, banks and startups across India now trust Penzo for their stationery." },
  { year: "Today", title: "Still testing every page", text: "Every new paper stock is tested with fountain pens, gel pens and markers before it ships." },
];

export const team = [
  { name: "Aarav Patel", role: "Founder & CEO" },
  { name: "Nisha Rao", role: "Head of Product" },
  { name: "Karan Shah", role: "Corporate Partnerships" },
  { name: "Ishita Menon", role: "Operations & Quality" },
];

export const craft = [
  { title: "Paper selection", text: "Ivory and white stocks from 80 to 120 GSM, chosen for low ghosting and zero bleed.", photo: "1483546363825-7ebf25fb7513" },
  { title: "Binding & finishing", text: "Thread-sewn, lay-flat bindings with rounded corners and reinforced spines.", photo: "1591195852468-03a01d1375d6" },
  { title: "Quality control", text: "Every batch is sampled and tested by hand before it leaves our studio.", photo: "1456735190827-d1262f71b8a3" },
];

export const audiences = [
  { title: "Corporates", text: "Onboarding kits, desk essentials and branded gifts for teams of any size.", photo: "1674620213535-9b2a2553ef40" },
  { title: "Schools & colleges", text: "Term-wise supply of notebooks, art material and exam stationery.", photo: "1568871391149-449702439177" },
  { title: "Events & conferences", text: "Delegate kits with notepads, pens and planners — packed and labelled.", photo: "1513128034602-7814ccaddd4e" },
  { title: "Retailers & resellers", text: "Wholesale pricing and display-ready packaging for stationery stores.", photo: "1779684998915-c2ac20725a82" },
];

export const brandingOptions = [
  { title: "Screen & UV printing", text: "Full-colour logos on covers, pens and packaging." },
  { title: "Foil & blind embossing", text: "Premium gold, silver or debossed finishes on journals." },
  { title: "Laser engraving", text: "Permanent, precise names and logos on metal pens." },
  { title: "Custom packaging", text: "Branded boxes, sleeves and thank-you cards." },
];

export const tiers = [
  { range: "50 – 199 units", discount: "10% off", perks: ["Standard branding", "Delivery in 7–10 days", "Email support"] },
  { range: "200 – 999 units", discount: "20% off", perks: ["Free logo setup", "Physical samples", "Dedicated account manager"], highlight: true },
  { range: "1,000+ units", discount: "Custom", perks: ["Custom products & packaging", "Staggered deliveries", "Priority production slots"] },
];

export const bulkFaqs: FaqItem[] = [
  { q: "What is the minimum order quantity for bulk pricing?", a: "Bulk pricing starts at 50 units per product. For custom-branded items the minimum is usually 100 units, depending on the printing method." },
  { q: "Can we see samples before placing an order?", a: "Yes. We send physical samples for orders above 200 units, and digital mock-ups of your branding for every order." },
  { q: "How long does a bulk order take?", a: "Standard bulk orders ship in 7–10 working days. Custom-branded orders typically take 2–3 weeks including approval of the mock-up." },
  { q: "Do you deliver to multiple addresses?", a: "We can pack and ship individually to remote employees or multiple office locations anywhere in India." },
  { q: "Which payment terms do you offer businesses?", a: "We accept bank transfer and UPI. Registered businesses can request 30-day credit terms after their first order." },
];

export const generalFaqs: FaqItem[] = [
  { q: "How long does delivery take?", a: "Orders are dispatched within 48 hours and usually arrive in 3–7 working days, depending on your location." },
  { q: "Can I return a product?", a: "Unused products in original packaging can be returned within 7 days of delivery. See our shipping & returns policy for details." },
  { q: "Do you ship outside India?", a: "Currently we deliver across India only. For international bulk orders, contact our team for a custom quote." },
  { q: "Are your notebooks fountain-pen friendly?", a: "Our 100 GSM and 120 GSM papers are tested with fountain pens and show minimal ghosting and no bleed-through." },
];
