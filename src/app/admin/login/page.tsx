import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LoginForm } from "@/components/admin/login-form";
import { Illustration } from "@/components/site/illustration";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Admin login" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-paper md:flex">
        <Logo light tagline className="relative" />
        <div className="ruled absolute inset-0 opacity-10" />
        <div className="relative grid grid-cols-3 gap-6 opacity-90">
          {(["notebook", "pen", "art", "planner", "pencil", "gift"] as const).map((k, i) => (
            <Illustration key={k} kind={k} accent={["#e4572e", "#2b59c3", "#e4572e", "#7b5bd6", "#f2c14e", "#d64590"][i]} className="w-full" />
          ))}
        </div>
        <p className="relative max-w-sm font-display text-4xl leading-tight font-semibold">Manage your catalogue, enquiries and reviews in one place.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl">Welcome back</h1>
          <p className="mt-2 mb-8 text-muted-foreground">Sign in to the {site.shortName} admin panel.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
