"use client";

import { useState } from "react";
import { todoActions, useTodos } from "@/lib/todo-store";

type Filter = "all" | "active" | "done";
const filters: Filter[] = ["all", "active", "done"];

export function TodoList() {
  const { todos, ready } = useTodos();
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done,
  );
  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          todoActions.add(text);
          setText("");
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo"
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-xl bg-accent px-5 py-3 font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
      </form>

      <div className="flex gap-1" role="tablist" aria-label="Filter todos">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
              filter === f
                ? "bg-foreground text-background"
                : "text-muted hover:bg-border/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {!ready ? (
          <li className="px-4 py-10 text-center text-muted">Loading…</li>
        ) : visible.length === 0 ? (
          <li className="px-4 py-10 text-center text-muted">
            {todos.length === 0
              ? "Nothing here yet — add your first task above."
              : "No todos match this filter."}
          </li>
        ) : (
          visible.map((todo) => (
            <li key={todo.id} className="group flex items-center gap-3 px-4 py-3">
              <input
                id={`todo-${todo.id}`}
                type="checkbox"
                checked={todo.done}
                onChange={() => todoActions.toggle(todo.id)}
                className="h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 cursor-pointer break-words ${
                  todo.done ? "text-muted line-through" : ""
                }`}
              >
                {todo.text}
              </label>
              <button
                onClick={() => todoActions.remove(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="rounded-lg px-2 py-1 text-muted opacity-60 transition hover:bg-danger/10 hover:text-danger hover:opacity-100 focus-visible:opacity-100"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {remaining} {remaining === 1 ? "item" : "items"} left
        </span>
        {completed > 0 && (
          <button
            onClick={todoActions.clearCompleted}
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear completed ({completed})
          </button>
        )}
      </div>
    </div>
  );
}
