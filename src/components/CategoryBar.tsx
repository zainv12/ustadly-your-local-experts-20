import type { Category } from "@/data/professionals";
import { Wrench, Hammer, Droplet, GraduationCap, Stethoscope, LayoutGrid } from "lucide-react";

const ICONS: Record<Category, React.ReactNode> = {
  Electricians: <Wrench className="h-5 w-5" />,
  Carpenters: <Hammer className="h-5 w-5" />,
  Plumbers: <Droplet className="h-5 w-5" />,
  Teachers: <GraduationCap className="h-5 w-5" />,
  Doctors: <Stethoscope className="h-5 w-5" />,
};

export type CategoryFilter = Category | "All";

export function CategoryBar({ value, onChange, options }: { value: CategoryFilter; onChange: (v: CategoryFilter) => void; options: Category[] }) {
  const all: { key: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { key: "All", label: "All", icon: <LayoutGrid className="h-5 w-5" /> },
    ...options.map((o) => ({ key: o, label: o, icon: ICONS[o] })),
  ];
  return (
    <div className="relative -mt-10 z-20 mx-auto w-full max-w-6xl px-4">
      <div className="glass-card rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          {all.map((c) => {
            const active = value === c.key;
            return (
              <button
                key={c.key}
                onClick={() => onChange(c.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  active ? "bg-brand text-brand-foreground scale-105 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {c.icon}
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
