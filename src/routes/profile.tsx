import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — Ustaadly" }] }),
});

function Profile() {
  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <h1 className="font-display text-4xl font-black text-white">Your Profile</h1>
          <p className="mt-4 text-white/80">Sign in to see your bookings and saved pros.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login" className="rounded-full bg-brand px-8 py-3 font-semibold text-brand-foreground hover:scale-105 transition">Login</Link>
            <Link to="/signup" className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10 transition">Sign up</Link>
          </div>
        </div>
      </ToolsBackground>
    </div>
  );
}
