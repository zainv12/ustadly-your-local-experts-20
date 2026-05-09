import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — Ustaadly" }] }),
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const res = login(u.trim(), p);
    if (!res.ok) return setErr(res.error || "Login failed");
    if (res.role === "admin") navigate({ to: "/admin" });
    else if (res.role === "worker") navigate({ to: "/worker" });
    else navigate({ to: "/home" });
  };

  return (
    <ToolsBackground overlay="bg-navy/70">
      <form onSubmit={onSubmit} className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
        <h1 className="text-center font-display text-5xl font-black text-brand text-shadow-glow">Ustaadly.</h1>
        {err && <p className="text-center text-destructive">{err}</p>}
        <label className="block animate-float-up">
          <span className="mb-2 block text-center text-sm text-white/80">Username</span>
          <input value={u} onChange={(e) => setU(e.target.value)} className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white outline-none focus:bg-white/40" />
        </label>
        <label className="block animate-float-up delay-100">
          <span className="mb-2 block text-center text-sm text-white/80">Password</span>
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white outline-none focus:bg-white/40" />
        </label>
        <Link to="/signup" className="text-center text-white/80 hover:text-white">Need a customer account?</Link>
        <button className="input-glow mx-auto rounded-full bg-brand px-12 py-3 font-semibold text-brand-foreground transition hover:scale-105">
          Login
        </button>
      </form>
    </ToolsBackground>
  );
}
