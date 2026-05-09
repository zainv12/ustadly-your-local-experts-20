import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { professionals } from "@/data/professionals";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({ meta: [{ title: "Search — Ustaadly" }] }),
});

function SearchPage() {
  const { q: initialQ } = Route.useSearch();
  const [q, setQ] = useState(initialQ);
  const filtered = professionals.filter((p) =>
    [p.name, p.trade, p.category, p.location].some((s) => s.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-display text-5xl font-black text-white mb-8">Search</h1>
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search electrician, plumber, carpenter…"
              className="input-glow w-full rounded-full bg-white/20 py-4 pl-14 pr-6 text-white placeholder-white/60 outline-none"
            />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div key={p.id} className="animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ProfessionalCard pro={p} />
              </div>
            ))}
          </div>
          {!filtered.length && <p className="mt-10 text-white/70">No professionals match your search.</p>}
        </div>
      </ToolsBackground>
    </div>
  );
}
