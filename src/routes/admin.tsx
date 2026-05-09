import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";
import { Ban, CheckCircle2, Trash2, LogOut, Users, MessageSquareWarning, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — Ustaadly" }] }),
});

function Admin() {
  const { session, login, workers, complaints, blockWorker, removeWorker, resolveComplaint, logout } = useAuth();
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"workers" | "complaints">("workers");

  useEffect(() => { setErr(""); }, [u, p]);

  if (!session || session.role !== "admin") {
    return (
      <ToolsBackground overlay="bg-navy/75">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const r = login(u.trim(), p);
            if (!r.ok || r.role !== "admin") setErr(r.error || "Admin credentials required");
          }}
          className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6"
        >
          <h1 className="text-center font-display text-4xl font-black text-brand">Admin</h1>
          {err && <p className="text-center text-destructive">{err}</p>}
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" className="input-glow rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/70 outline-none" />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" className="input-glow rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/70 outline-none" />
          <p className="text-center text-xs text-white/60">Default: admin / admin</p>
          <button className="input-glow mx-auto rounded-full bg-brand px-12 py-3 font-semibold text-brand-foreground hover:scale-105 transition">Sign in</button>
        </form>
      </ToolsBackground>
    );
  }

  const open = complaints.filter((c) => c.status === "open").length;

  return (
    <ToolsBackground overlay="bg-navy/75">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black text-brand inline-flex items-center gap-3"><ShieldCheck /> Admin Panel</h1>
            <p className="text-white/70">Manage workers and customer complaints</p>
          </div>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-white hover:bg-white/25 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="mt-8 flex gap-2">
          <TabBtn active={tab === "workers"} onClick={() => setTab("workers")} icon={<Users className="h-4 w-4" />} label={`Workers (${workers.length})`} />
          <TabBtn active={tab === "complaints"} onClick={() => setTab("complaints")} icon={<MessageSquareWarning className="h-4 w-4" />} label={`Complaints (${open} open)`} />
        </div>

        {tab === "workers" && (
          <div className="mt-6 rounded-2xl bg-card p-6 animate-float-up">
            {workers.length === 0 && <p className="text-white/70">No workers yet.</p>}
            <div className="space-y-3">
              {workers.map((w) => (
                <div key={w.username} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy/60 p-4">
                  <div>
                    <p className="font-semibold text-white">{w.name} <span className="text-white/60 text-sm">@{w.username}</span></p>
                    <p className="text-sm text-white/70">{w.trade} · {w.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.blocked ? (
                      <span className="rounded-full bg-destructive/30 px-3 py-1 text-xs text-white">Blocked</span>
                    ) : (
                      <span className="rounded-full bg-brand/20 px-3 py-1 text-xs text-brand">Active</span>
                    )}
                    <button onClick={() => blockWorker(w.username, !w.blocked)} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/25">
                      <Ban className="h-3.5 w-3.5" /> {w.blocked ? "Unblock" : "Block"}
                    </button>
                    <button onClick={() => removeWorker(w.username)} className="inline-flex items-center gap-1 rounded-full bg-destructive/70 px-3 py-1.5 text-xs text-white hover:bg-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "complaints" && (
          <div className="mt-6 rounded-2xl bg-card p-6 animate-float-up">
            {complaints.length === 0 && <p className="text-white/70">No complaints filed yet.</p>}
            <div className="space-y-3">
              {complaints.slice().sort((a, b) => b.createdAt - a.createdAt).map((c) => (
                <div key={c.id} className="rounded-xl bg-navy/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{c.subject}</p>
                      <p className="text-xs text-white/60">From {c.from} · against {c.against} · {new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs ${c.status === "open" ? "bg-destructive/30 text-white" : "bg-brand/20 text-brand"}`}>{c.status}</span>
                      {c.status === "open" && (
                        <button onClick={() => resolveComplaint(c.id)} className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/85">{c.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolsBackground>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${active ? "bg-brand text-brand-foreground" : "bg-white/10 text-white hover:bg-white/20"}`}>
      {icon} {label}
    </button>
  );
}
