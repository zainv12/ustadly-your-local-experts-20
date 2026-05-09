import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { professionals } from "@/data/professionals";

export const Route = createFileRoute("/urgent")({
  component: Urgent,
  head: () => ({ meta: [{ title: "Urgent help — Ustaadly" }] }),
});

function Urgent() {
  const top = professionals.filter((p) => p.rating >= 4);
  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-display text-5xl font-black text-brand animate-shimmer">Urgent</h1>
          <p className="mt-3 text-white/80">Available right now for emergency jobs.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((p, i) => (
              <div key={p.id} className="animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ProfessionalCard pro={p} />
              </div>
            ))}
          </div>
        </div>
      </ToolsBackground>
    </div>
  );
}
