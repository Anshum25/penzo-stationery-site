"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitEnquiry } from "@/lib/actions/public";
import type { FormState } from "@/lib/actions/types";
import { cn } from "@/lib/utils";

function Field({
  label,
  name,
  error,
  textarea,
  ...props
}: { label: string; name: string; error?: string[]; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls =
    "peer w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pt-6 pb-2 text-lg outline-none transition-colors placeholder:text-transparent focus:border-vermilion";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} rows={4} placeholder={label} className={cn(cls, "resize-none")} {...props} />
      ) : (
        <input name={name} placeholder={label} className={cls} {...props} />
      )}
      <span className="pointer-events-none absolute top-0 left-0 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-vermilion">
        {label}
      </span>
      {error && <span className="mt-1 block text-sm text-destructive">{error[0]}</span>}
    </label>
  );
}

export function ContactForm({ defaultType, defaultMessage }: { defaultType: "general" | "bulk"; defaultMessage?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, {});
  const [type, setType] = useState(defaultType);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state.ok ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-start gap-4 rounded-3xl bg-card p-10"
          >
            <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.1 }}>
              <CheckCircle2 className="size-14 text-sage" />
            </motion.span>
            <h3 className="font-display text-4xl">Message sent!</h3>
            <p className="text-muted-foreground">{state.message}</p>
          </motion.div>
        ) : (
          <motion.form key="form" action={action} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex gap-2">
              {(["general", "bulk"] as const).map((t) => (
                <label
                  key={t}
                  className={cn(
                    "relative cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                    type === t ? "border-ink text-paper" : "border-ink/15",
                  )}
                >
                  <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                  {type === t && <motion.span layoutId="type-pill" className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{t === "bulk" ? "Bulk / corporate order" : "General enquiry"}</span>
                </label>
              ))}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Field label="Your name" name="name" autoComplete="name" error={state.errors?.name} required />
              <Field label="Email" name="email" type="email" autoComplete="email" error={state.errors?.email} required />
              <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" error={state.errors?.phone} />
              <Field label={type === "bulk" ? "Company / school" : "Company (optional)"} name="company" autoComplete="organization" error={state.errors?.company} />
            </div>
            <Field
              label={type === "bulk" ? "What do you need, and roughly how many?" : "How can we help?"}
              name="message"
              textarea
              defaultValue={defaultMessage}
              error={state.errors?.message}
              required
            />
            {state.message && !state.ok && <p className="text-sm text-destructive">{state.message}</p>}
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-medium text-paper transition-colors hover:bg-vermilion disabled:opacity-60"
            >
              {pending ? <Loader2 className="size-5 animate-spin" /> : null}
              {pending ? "Sending…" : "Send message"}
              {!pending && <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
