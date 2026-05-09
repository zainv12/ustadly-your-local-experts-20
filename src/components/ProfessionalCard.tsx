import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Professional } from "@/data/professionals";

export function ProfessionalCard({ pro }: { pro: Professional }) {
  return (
    <Link
      to="/professional/$id"
      params={{ id: pro.id }}
      className="group flex shrink-0 w-[340px] items-center gap-5 rounded-2xl bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/20"
    >
      <img src={pro.photo} alt={pro.name} loading="lazy" width={96} height={96} className="h-24 w-24 rounded-full object-cover ring-2 ring-white/20" />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white">{pro.name}</h3>
        <p className="text-sm italic text-white/70">certified</p>
        <p className="text-base font-semibold text-white">{pro.trade}</p>
        <p className="mt-2 text-xs text-white/60">Ratings</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < pro.rating ? "fill-brand text-brand" : "fill-white/15 text-white/15"}`} />
          ))}
        </div>
      </div>
    </Link>
  );
}
