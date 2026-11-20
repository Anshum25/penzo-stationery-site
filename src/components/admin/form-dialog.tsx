"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/** A dialog wrapping a server-action form; closes and toasts on success. */
export function FormDialog({
  title,
  trigger,
  action,
  submitLabel = "Save",
  children,
}: {
  title: string;
  trigger: React.ReactElement;
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  submitLabel?: string;
  children: (errors: FormState["errors"]) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open && <Inner action={action} submitLabel={submitLabel} onDone={() => setOpen(false)}>{children}</Inner>}
      </DialogContent>
    </Dialog>
  );
}

function Inner({
  action,
  submitLabel,
  onDone,
  children,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  submitLabel: string;
  onDone: () => void;
  children: (errors: FormState["errors"]) => React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Saved");
      onDone();
    }
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-4">
      {children(state.errors)}
      {state.message && !state.ok && <p className="text-sm text-destructive">{state.message}</p>}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />} {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
