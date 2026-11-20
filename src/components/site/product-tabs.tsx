"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ProductTabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" className="flex gap-6 border-b border-ink/10">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn("relative pb-4 text-sm font-medium transition-colors", active === i ? "text-ink" : "text-muted-foreground hover:text-ink")}
          >
            {t.label}
            {active === i && <motion.span layoutId="product-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-6">
        {tabs[active].content}
      </motion.div>
    </div>
  );
}
