"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/lib/actions/auth";
import type { FormState } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required className="h-11" />
        {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>
      {state.message && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="h-11 w-full">
        {pending && <Loader2 className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}
