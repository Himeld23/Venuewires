"use client";

import { useSyncExternalStore } from "react";

// Small localStorage-backed store factory. Prototype-only persistence;
// the backend phase replaces these with real API/database calls.
export function createLocalStore<T>(key: string, initial: T) {
  let cache = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) cache = JSON.parse(raw) as T;
    } catch {}
  };

  const get = () => { load(); return cache; };
  const set = (v: T) => {
    cache = v;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => { load(); listeners.add(l); return () => { listeners.delete(l); }; };
  const useValue = () => useSyncExternalStore(subscribe, get, () => initial);

  return { get, set, useValue };
}

const noopSubscribe = () => () => {};
/** false during SSR/hydration, true once running in the browser. */
export function useClientReady() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
