import type { Metadata } from "next";
import { TodoList } from "@/components/todo-list";

export const metadata: Metadata = { title: "Todos · Taskly" };

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Your todos</h1>
      <p className="mb-6 mt-1 text-muted">Add tasks, tick them off, stay on top of things.</p>
      <TodoList />
    </>
  );
}
