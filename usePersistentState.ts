import { useCallback, useState } from "react";

/**
 * Tiny persistent store.
 * Every value lives in memory (so switching rooms or opening the rule cards
 * never loses progress) and is mirrored to localStorage when available
 * (so an accidental page refresh during the lesson is harmless too).
 */
const PREFIX = "review-vault:v1:";
const memory = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (memory.has(key)) return memory.get(key) as T;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw != null) {
      const parsed = JSON.parse(raw) as T;
      memory.set(key, parsed);
      return parsed;
    }
  } catch {
    /* storage unavailable — memory only */
  }
  return fallback;
}

function write(key: string, value: unknown) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — memory only */
  }
}

export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}

export function clearAllProgress() {
  memory.clear();
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* nothing to clear */
  }
}
