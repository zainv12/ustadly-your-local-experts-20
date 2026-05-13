import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Ustaadly" },
      { name: "description", content: "Ustaadly connects you with verified local professionals across Pakistan." },
    ],
  }),
});

function About() {
  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-3xl px-6 py-16 text-white">
          <h1 className="font-display text-5xl font-black animate-float-up">About Ustaadly</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85 animate-float-up delay-100">
            Ustaadly is a marketplace connecting you with verified local professionals — electricians, plumbers,
            carpenters, teachers, doctors and more. Every profile is reviewed and rated by real customers so you
            can hire with confidence.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["Verified", "Every pro is identity-checked."],
              ["Rated", "Real reviews from real jobs."],
              ["Local", "Find help in your neighborhood."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-2xl bg-card p-6 animate-float-up" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                <h3 className="text-xl font-bold text-brand">{t}</h3>
                <p className="mt-2 text-white/80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </ToolsBackground>
      <Footer />
    </div>
  );
}
