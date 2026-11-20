"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Newspaper, Package, X } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/journal", label: "Journal", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

export function Sidebar({ user, newEnquiries }: { user: { name: string; email: string }; newEnquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 pt-2">
        <Logo light markClassName="size-8" />
        <span className="ml-1 rounded-md bg-paper/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-paper/70 uppercase">Admin</span>
      </Link>
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-paper text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper",
            )}
          >
            <Icon className="size-4" />
            {label}
            {href === "/admin/enquiries" && newEnquiries > 0 && (
              <span className="ml-auto rounded-full bg-vermilion px-2 py-0.5 text-[11px] font-semibold text-paper">{newEnquiries}</span>
            )}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1 border-t border-paper/10 pt-4">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper">
          <ExternalLink className="size-4" /> View website
        </Link>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-paper/70 hover:bg-paper/10 hover:text-paper">
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
        <div className="px-3 pt-3 text-xs text-paper/50">
          <p className="font-medium text-paper/80">{user.name}</p>
          <p className="truncate">{user.email}</p>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-ink text-paper lg:block">{nav}</aside>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <span className="flex items-center gap-2">
          <Logo markClassName="size-7" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Admin</span>
        </span>
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted">
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink text-paper">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-md p-1 text-paper/70 hover:text-paper">
              <X className="size-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
