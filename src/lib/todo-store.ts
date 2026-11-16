"use client";

import { useSyncExternalStore } from "react";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

const STORAGE_KEY = "todos:v1";
const EMPTY: Todo[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedTodos: Todo[] = EMPTY;

function read(): Todo[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedTodos;
  }
  if (raw === cachedRaw) return cachedTodos;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : EMPTY;
    cachedTodos = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedTodos = EMPTY;
  }
  return cachedTodos;
}

function write(next: Todo[]) {
  cachedTodos = next;
  cachedRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // storage unavailable: keep in-memory state only
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;

/** Returns the todos plus a `ready` flag (false during SSR/hydration). */
export function useTodos() {
  const todos = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return { todos, ready };
}

export const todoActions = {
  add(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    write([
      { id: crypto.randomUUID(), text: trimmed, done: false, createdAt: Date.now() },
      ...read(),
    ]);
  },
  toggle(id: string) {
    write(read().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  },
  remove(id: string) {
    write(read().filter((t) => t.id !== id));
  },
  clearCompleted() {
    write(read().filter((t) => !t.done));
  },
};
