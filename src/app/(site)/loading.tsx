import { LogoMark } from "@/components/brand/logo";

/** Shown while a page's data loads during navigation. */
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6" role="status" aria-label="Loading">
      <LogoMark className="size-14 animate-pulse text-ink" />
      <div className="h-px w-32 overflow-hidden bg-ink/10">
        <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] bg-vermilion" />
      </div>
    </div>
  );
}
