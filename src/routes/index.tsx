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
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-5xl font-black text-brand text-shadow-glow animate-float-up sm:text-7xl md:text-9xl">
          Ustaadly<span className="text-brand">.</span>
        </h1>
        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
          <RoleCard to="/home" icon={<Briefcase className="h-12 w-12 text-brand" />} title="I'm a Customer" sub="Browse pros — no signup needed" delay="delay-200" />
          <RoleCard to="/login" icon={<HardHat className="h-12 w-12 text-brand" />} title="I'm a Worker" sub="Login to your account" delay="delay-300" />
        </div>

        <Link to="/login" className="mt-8 text-center text-white/80 hover:text-brand animate-float-up delay-500 sm:mt-10">Already have an account? Login</Link>
      </div>
    </ToolsBackground>
  );
}

function RoleCard({ to, icon, title, sub, delay }: { to: string; icon: React.ReactNode; title: string; sub: string; delay: string }) {
  return (
    <Link
      to={to}
      className={`glass-card group flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:bg-white/20 animate-float-up sm:p-10 ${delay}`}
    >
      <div className="transform transition group-hover:-translate-y-1 group-hover:scale-110">{icon}</div>
      <span className="text-lg font-semibold text-white sm:text-xl">{title}</span>
      <span className="text-sm text-white/70">{sub}</span>
    </Link>
  );
}
