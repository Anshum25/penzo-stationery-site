"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { setPostPublished } from "@/lib/actions/admin";
import { Switch } from "@/components/ui/switch";

export function PostPublishSwitch({ id, value }: { id: number; value: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [, start] = useTransition();
  return (
    <Switch
      aria-label="Published"
      checked={optimistic}
      onCheckedChange={(checked) =>
        start(async () => {
          setOptimistic(checked);
          await setPostPublished(id, checked);
          toast.success(checked ? "Article published" : "Article hidden");
        })
      }
    />
  );
}
