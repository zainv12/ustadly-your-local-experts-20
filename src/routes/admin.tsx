import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";
import { Ban, CheckCircle2, Trash2, LogOut, Users, MessageSquareWarning, ShieldCheck, BadgeCheck, KeyRound, Plus, Minus, Search, UserCircle2, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — Ustaadly" }] }),
});

function Admin() {
  const {
    session, login, workers, customers, complaints,
    blockWorker, removeWorker, resolveComplaint, logout,
    verifyWorker, resetWorkerPassword, adjustEarnings, removeCustomer,
  } = useAuth();
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"workers" | "customers" | "complaints">("workers");
  const [query, setQuery] = useState("");

  useEffect(() => { setErr(""); }, [u, p]);

  const open = complaints.filter((c) => c.status === "open").length;
  const totalEarnings = workers.reduce((s, w) => s + w.earnings, 0);

  const filteredWorkers = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return workers;
    return workers.filter((w) => [w.name, w.username, w.trade, w.country].some((s) => s.toLowerCase().includes(q)));
  }, [workers, query]);

  const filteredCustomers = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) => [c.name, c.username, c.email, c.country].some((s) => s.toLowerCase().includes(q)));
  }, [customers, query]);

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

  return (
    <ToolsBackground overlay="bg-navy/75">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black text-brand inline-flex items-center gap-3"><ShieldCheck /> Admin Panel</h1>
            <p className="text-white/70">Manage workers, customers, and complaints</p>
          </div>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-white hover:bg-white/25 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Stat label="Workers" value={workers.length} icon={<Users className="h-4 w-4" />} />
          <Stat label="Customers" value={customers.length} icon={<UserCircle2 className="h-4 w-4" />} />
          <Stat label="Open Complaints" value={open} icon={<MessageSquareWarning className="h-4 w-4" />} />
          <Stat label="Platform Earnings" value={`Rs ${totalEarnings.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <TabBtn active={tab === "workers"} onClick={() => setTab("workers")} icon={<Users className="h-4 w-4" />} label={`Workers (${workers.length})`} />
          <TabBtn active={tab === "customers"} onClick={() => setTab("customers")} icon={<UserCircle2 className="h-4 w-4" />} label={`Customers (${customers.length})`} />
          <TabBtn active={tab === "complaints"} onClick={() => setTab("complaints")} icon={<MessageSquareWarning className="h-4 w-4" />} label={`Complaints (${open} open)`} />
          <div className="relative ml-auto w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-full rounded-full bg-white/15 py-2 pl-10 pr-4 text-sm text-white placeholder-white/60 outline-none" />
          </div>
        </div>

        {tab === "workers" && (
          <div className="mt-6 rounded-2xl bg-card p-6 animate-float-up">
            {filteredWorkers.length === 0 && <p className="text-white/70">No workers match.</p>}
            <div className="space-y-3">
              {filteredWorkers.map((w) => (
                <div key={w.username} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy/60 p-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-white inline-flex items-center gap-2">
                      {w.name} <span className="text-white/60 text-sm">@{w.username}</span>
                      {w.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                    </p>
                    <p className="text-sm text-white/70">{w.trade} · {w.country} · Rs {w.earnings.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {w.blocked
                      ? <span className="rounded-full bg-destructive/30 px-3 py-1 text-xs text-white">Blocked</span>
                      : <span className="rounded-full bg-brand/20 px-3 py-1 text-xs text-brand">Active</span>}
                    <IconBtn onClick={() => verifyWorker(w.username, !w.verified)}>
                      <BadgeCheck className="h-3.5 w-3.5" /> {w.verified ? "Unverify" : "Verify"}
                    </IconBtn>
                    <IconBtn onClick={() => adjustEarnings(w.username, 1000)}><Plus className="h-3.5 w-3.5" /> 1k</IconBtn>
                    <IconBtn onClick={() => adjustEarnings(w.username, -1000)}><Minus className="h-3.5 w-3.5" /> 1k</IconBtn>
                    <IconBtn onClick={() => {
                      const np = window.prompt(`New password for @${w.username}:`);
                      if (np && np.length >= 3) resetWorkerPassword(w.username, np);
                    }}><KeyRound className="h-3.5 w-3.5" /> Reset</IconBtn>
                    <IconBtn onClick={() => blockWorker(w.username, !w.blocked)}>
                      <Ban className="h-3.5 w-3.5" /> {w.blocked ? "Unblock" : "Block"}
                    </IconBtn>
                    <button onClick={() => { if (confirm(`Remove ${w.name}?`)) removeWorker(w.username); }} className="inline-flex items-center gap-1 rounded-full bg-destructive/70 px-3 py-1.5 text-xs text-white hover:bg-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "customers" && (
          <div className="mt-6 rounded-2xl bg-card p-6 animate-float-up">
            {filteredCustomers.length === 0 && <p className="text-white/70">No customer accounts yet.</p>}
            <div className="space-y-3">
              {filteredCustomers.map((c) => (
                <div key={c.username} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy/60 p-4">
                  <div>
                    <p className="font-semibold text-white">{c.name} <span className="text-white/60 text-sm">@{c.username}</span></p>
                    <p className="text-sm text-white/70">{c.email} · {c.phone} · {c.country}</p>
                  </div>
                  <button onClick={() => { if (confirm(`Remove customer ${c.name}?`)) removeCustomer(c.username); }} className="inline-flex items-center gap-1 rounded-full bg-destructive/70 px-3 py-1.5 text-xs text-white hover:bg-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
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

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/25">
      {children}
    </button>
  );
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-white/70 text-xs">{icon} {label}</div>
      <div className="mt-1 text-2xl font-black text-white">{value}</div>
    </div>
  );
}
