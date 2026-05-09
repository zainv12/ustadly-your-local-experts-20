import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Professional } from "@/data/professionals";

export function CategoryRow({ title, items }: { title: string; items: Professional[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 380, behavior: "smooth" });

  return (
    <section className="px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-4xl md:text-5xl font-black text-white">Top {title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scroll-smooth">
        {items.map((p, i) => (
          <div key={p.id} className="animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
            <ProfessionalCard pro={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
