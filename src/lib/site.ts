// Central brand config — swap these for the client's real details.
export const site = {
  name: "Penzo",
  shortName: "Penzo",
  tagline: "Premium stationery for work worth doing.",
  description:
    "Notebooks, writing instruments and office essentials made to a higher standard — for professionals, students and the companies that equip them.",
  email: "hello@penzo.example",
  phone: "+91 98765 43210",
  address: "12 Paper Lane, Ahmedabad, Gujarat 380009",
  hours: "Mon – Sat, 10:00 am – 7:00 pm",
  // OpenStreetMap embed centred on the studio — update the coordinates for the real address.
  mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=72.52%2C23.00%2C72.60%2C23.06&layer=mapnik&marker=23.03%2C72.56",
  currency: "INR",
  locale: "en-IN",
  socials: {
    instagram: "#",
    linkedin: "#",
    whatsapp: "#",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Bulk Orders", href: "/bulk-orders" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Shipping & returns", href: "/shipping" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
  ],
} as const;

export function formatPrice(value: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
