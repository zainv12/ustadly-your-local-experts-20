import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/history")({
  component: History,
  head: () => ({ meta: [{ title: "History — Ustaadly" }] }),
});

function History() {
  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="font-display text-5xl font-black text-white">History</h1>
          <div className="mt-10 rounded-2xl bg-card p-10 text-center text-white/80 animate-float-up">
            You haven't hired anyone yet. Browse the <a href="/home" className="text-brand underline">home page</a> to get started.
          </div>
        </div>
      </ToolsBackground>
    </div>
  );
}
