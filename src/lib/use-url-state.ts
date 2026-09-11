"use client";

import { useCallback, useSyncExternalStore } from "react";

// The URL query string as an external store. Server render and hydration see
// an empty query (so the full catalog is in the HTML); the client re-renders
// with the real query right after hydration, and again on back/forward.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useSearchString(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type Updates = Record<string, string | null | undefined>;

// Write a set of params without touching any others, then notify subscribers.
export function useUpdateSearch() {
  return useCallback((updates: Updates) => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    // Keep Next's router state (history.state) intact so its router stays in sync.
    window.history.replaceState(window.history.state, "", url);
    listeners.forEach((l) => l());
  }, []);
}

// Pick a param, accepting it only if it is one of the allowed values.
export function pickParam<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T | null {
  const v = params.get(key);
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}
