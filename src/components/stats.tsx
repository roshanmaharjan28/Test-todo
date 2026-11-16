"use client";

import Link from "next/link";
import { useTodos } from "@/lib/todo-store";

export function Stats() {
  const { todos, ready } = useTodos();
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const active = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const cards = [
    { label: "Total", value: total },
    { label: "Active", value: active },
    { label: "Completed", value: done },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-surface p-4 text-center shadow-sm"
          >
            <div className="text-3xl font-semibold tabular-nums">{ready ? c.value : "–"}</div>
            <div className="mt-1 text-sm text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted tabular-nums">{ready ? pct : 0}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={ready ? pct : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${ready ? pct : 0}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          {!ready || total === 0
            ? "Add some todos to see your progress."
            : active === 0
              ? "All done — nice work! 🎉"
              : `${active} to go. Keep it up!`}
        </p>
      </div>

      <Link
        href="/"
        className="inline-block rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent-hover"
      >
        ← Back to todos
      </Link>
    </div>
  );
}
