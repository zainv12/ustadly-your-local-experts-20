import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";
import { CategoryRow } from "@/components/CategoryRow";
import { CategoryBar, type CategoryFilter } from "@/components/CategoryBar";
import { professionals, categories } from "@/data/professionals";
import hero from "@/assets/hero-construction.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Ustaadly — Find Top Local Professionals" },
      { name: "description", content: "Browse top-rated electricians, carpenters, plumbers, teachers and doctors near you." },
    ],
  }),
  component: Home,
});

function Home() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const visibleCats = filter === "All" ? categories : [filter];

  return (
    <div>
      <Header />
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img src={hero} alt="Construction workers at night" width={1920} height={1080} className="h-full w-full object-cover animate-float-up" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy" />
      </div>
      <CategoryBar value={filter} onChange={setFilter} options={[...categories]} />
      <ToolsBackground overlay="bg-navy/70">
        <div className="pt-8">
          {visibleCats.map((cat) => {
            const items = professionals.filter((p) => p.category === cat);
            if (!items.length) return null;
            return <CategoryRow key={cat} title={cat} items={items} />;
          })}
        </div>
        <footer className="px-8 py-12 text-center text-sm text-white/50">© {new Date().getFullYear()} Ustaadly.</footer>
      </ToolsBackground>
    </div>
  );
}
