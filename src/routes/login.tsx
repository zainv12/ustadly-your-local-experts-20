import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — Ustaadly" }] }),
});

function Login() {
  return (
    <ToolsBackground overlay="bg-navy/70">
      <form className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-center font-display text-5xl font-black text-brand text-shadow-glow">Ustaadly.</h1>
        {["E-mail", "Password"].map((label, i) => (
          <label key={label} className="block animate-float-up" style={{ animationDelay: `${i * 100}ms` }}>
            <span className="mb-2 block text-center text-sm text-white/80">{label}</span>
            <input type={label === "Password" ? "password" : "email"} className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/60 outline-none focus:bg-white/40" />
          </label>
        ))}
        <Link to="/signup" className="text-center text-white/80 hover:text-white">Need an account?</Link>
        <button className="input-glow mx-auto rounded-full bg-white/30 px-12 py-3 font-semibold text-white transition hover:scale-105 hover:bg-white/40">
          Login
        </button>
      </form>
    </ToolsBackground>
  );
}
