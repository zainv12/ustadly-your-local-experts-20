import { createFileRoute } from "@tanstack/react-router";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — Ustaadly" }] }),
});

function Admin() {
  return (
    <ToolsBackground overlay="bg-navy/75">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-center font-display text-4xl font-black text-brand">Admin</h1>
        <input placeholder="Admin email" className="input-glow rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/70 outline-none" />
        <input type="password" placeholder="Password" className="input-glow rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/70 outline-none" />
        <button className="input-glow mx-auto rounded-full bg-brand px-12 py-3 font-semibold text-brand-foreground hover:scale-105 transition">Sign in</button>
      </div>
    </ToolsBackground>
  );
}
