"use client";

import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store for the compare tray (2–4 venues, per brief).
const KEY = "vw-compare";
export const MAX_COMPARE = 4;
const EMPTY: string[] = [];

let cache: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(raw)) cache = raw.slice(0, MAX_COMPARE);
  } catch {}
}

function set(next: string[]) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

const snapshot = () => { load(); return cache; };

export function useCompare() {
  const slugs = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  return {
    slugs,
    has: (s: string) => slugs.includes(s),
    toggle: (s: string) => {
      if (slugs.includes(s)) set(slugs.filter((x) => x !== s));
      else if (slugs.length < MAX_COMPARE) set([...slugs, s]);
    },
    remove: (s: string) => set(slugs.filter((x) => x !== s)),
    clear: () => set([]),
    full: slugs.length >= MAX_COMPARE,
  };
}
