import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolsBackground } from "@/components/ToolsBackground";
import { CategoryRow } from "@/components/CategoryRow";
import { professionals, categories, type Category } from "@/data/professionals";
import heroConstruction from "@/assets/hero-construction.jpg";
import heroTeacher from "@/assets/hero-teacher.jpg";
import heroDoctor from "@/assets/hero-doctor.jpg";
import heroPlumber from "@/assets/hero-plumber.jpg";
import heroElectrician from "@/assets/hero-electrician.jpg";

const HERO_SLIDES = [
  { src: heroConstruction, alt: "Construction workers at night" },
  { src: heroTeacher, alt: "Teacher in a modern classroom" },
  { src: heroDoctor, alt: "Doctor in a hospital corridor" },
  { src: heroPlumber, alt: "Plumber fixing pipes" },
  { src: heroElectrician, alt: "Electrician working on a panel" },
];

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
  const navigate = useNavigate();
  const [picked, setPicked] = useState<Category | "">("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 10000);
    return () => clearInterval(t);
  }, []);

  const go = () => {
    if (!picked) return;
    navigate({ to: "/search", search: { q: picked } as never });
  };

  return (
    <div>
      <Header />
      <div className="relative h-[70vh] w-full overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1920}
            height={1080}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${i === slide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/30 to-navy" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-black text-brand text-shadow-glow animate-float-up">
            Find Your Pro
          </h1>

          <div className="mt-8 w-full max-w-2xl glass-card rounded-full p-2 flex items-center gap-2 animate-float-up delay-200">
            <select
              value={picked}
              onChange={(e) => setPicked(e.target.value as Category)}
              className="flex-1 rounded-full bg-transparent px-5 py-3 text-white outline-none"
            >
              <option value="" className="text-navy">What do you need?</option>
              {categories.map((c) => (
                <option key={c} value={c} className="text-navy">{c}</option>
              ))}
            </select>
            <button
              onClick={go}
              className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-brand-foreground transition hover:scale-105"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      </div>

      <ToolsBackground overlay="bg-navy/70">
        <div className="pt-8">
          {categories.map((cat) => {
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
