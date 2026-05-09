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
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <h1 className="font-display text-7xl md:text-9xl font-black text-brand text-shadow-glow animate-float-up">
          Ustaadly<span className="text-brand">.</span>
        </h1>
        <p className="mt-4 text-lg text-white/70 animate-float-up delay-100 text-center max-w-xl">
          Hire trusted local professionals in seconds — or grow your trade business.
        </p>

        <div className="mt-14 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          <RoleCard to="/signup" icon={<Briefcase className="h-12 w-12 text-brand" />} title="I'm a Customer" sub="Find & hire" delay="delay-200" />
          <RoleCard to="/login" icon={<HardHat className="h-12 w-12 text-brand" />} title="I'm a Worker" sub="Login to your account" delay="delay-300" />
        </div>

        <Link to="/login" className="mt-10 text-white/80 hover:text-brand animate-float-up delay-500">Already have an account? Login</Link>
      </div>
    </ToolsBackground>
  );
}

function RoleCard({ to, icon, title, sub, delay }: { to: string; icon: React.ReactNode; title: string; sub: string; delay: string }) {
  return (
    <Link
      to={to}
      className={`glass-card group flex flex-col items-center justify-center gap-3 rounded-2xl p-10 transition-all duration-300 hover:scale-[1.03] hover:bg-white/20 animate-float-up ${delay}`}
    >
      <div className="transform transition group-hover:-translate-y-1 group-hover:scale-110">{icon}</div>
      <span className="text-xl font-semibold text-white">{title}</span>
      <span className="text-sm text-white/70">{sub}</span>
    </Link>
  );
}
