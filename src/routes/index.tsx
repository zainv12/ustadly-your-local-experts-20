import { createFileRoute, Link } from "@tanstack/react-router";
import { HardHat, Briefcase } from "lucide-react";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ustaadly — Hire Local Professionals" },
      { name: "description", content: "Find trusted local plumbers, electricians, teachers, doctors and more on Ustaadly." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <ToolsBackground overlay="bg-navy/55">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="font-display text-7xl md:text-9xl font-black text-brand text-shadow-glow animate-float-up">
          Ustaadly<span className="text-brand">.</span>
        </h1>
        <p className="mt-4 text-lg text-white/70 animate-float-up delay-100">Hire trusted local professionals in seconds.</p>

        <div className="mt-16 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          <RoleCard to="/signup" icon={<HardHat className="h-14 w-14 text-brand" />} title="Searching for Jobs?" delay="delay-200" />
          <RoleCard to="/home" icon={<Briefcase className="h-14 w-14 text-brand" />} title="Searching for Workers?" delay="delay-300" />
        </div>

        <Link to="/admin" className="mt-12 text-brand hover:underline animate-float-up delay-500">Admin</Link>
      </div>
    </ToolsBackground>
  );
}

function RoleCard({ to, icon, title, delay }: { to: string; icon: React.ReactNode; title: string; delay: string }) {
  return (
    <Link
      to={to}
      className={`glass-card group flex flex-col items-center justify-center gap-4 rounded-2xl p-10 transition-all duration-300 hover:scale-[1.03] hover:bg-white/20 animate-float-up ${delay}`}
    >
      <div className="transform transition group-hover:-translate-y-1 group-hover:scale-110">{icon}</div>
      <span className="text-xl font-semibold text-white">{title}</span>
    </Link>
  );
}
