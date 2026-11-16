import type { Metadata } from "next";
import { Stats } from "@/components/stats";

export const metadata: Metadata = { title: "Stats · Taskly" };

export default function StatsPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Stats</h1>
      <p className="mb-6 mt-1 text-muted">A quick look at how you&apos;re doing.</p>
      <Stats />
    </>
  );
}
