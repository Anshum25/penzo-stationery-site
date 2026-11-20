"use client";

import { useSyncExternalStore } from "react";

// Lets hero animations wait until the preloader has lifted.
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  done = true;
  listeners.forEach((l) => l());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => done,
    () => false,
  );
}
