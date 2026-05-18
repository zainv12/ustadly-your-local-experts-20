import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Professional } from "@/data/professionals";

export function CategoryRow({ title, items }: { title: string; items: Professional[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.min(380, window.innerWidth - 48), behavior: "smooth" });

  return (
    <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl md:text-5xl">Top {title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth sm:gap-6">
        {items.map((p, i) => (
          <div key={p.id} className="w-[min(86vw,340px)] shrink-0 animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
            <ProfessionalCard pro={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
