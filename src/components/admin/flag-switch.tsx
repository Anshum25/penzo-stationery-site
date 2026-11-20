"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { toggleProductFlag } from "@/lib/actions/admin";
import { Switch } from "@/components/ui/switch";

export function FlagSwitch({ id, flag, value, label }: { id: number; flag: "featured" | "inStock"; value: boolean; label: string }) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [, start] = useTransition();
  return (
    <Switch
      aria-label={label}
      checked={optimistic}
      onCheckedChange={(checked) =>
        start(async () => {
          setOptimistic(checked);
          await toggleProductFlag(id, flag, checked);
          toast.success(`${label} ${checked ? "on" : "off"}`);
        })
      }
    />
  );
}
