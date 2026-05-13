import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { Footer } from "@/components/Footer";
import { useAuth, TRADES } from "@/lib/auth";
import { Wallet, Briefcase, History, Star, LogOut, ClipboardList, User, Pencil, BadgeCheck, Megaphone, MapPin, X, Plus } from "lucide-react";

export const Route = createFileRoute("/worker")({
  component: WorkerDashboard,
  head: () => ({ meta: [{ title: "Worker Dashboard — Ustaadly" }] }),
});

const recentJobs = [
  { id: "j1", customer: "Ali Raza", task: "Ceiling fan installation", date: "2026-05-04", amount: 3500, status: "Completed" },
  { id: "j2", customer: "Fatima Noor", task: "Switchboard repair", date: "2026-05-02", amount: 1800, status: "Completed" },
  { id: "j3", customer: "Hassan Q.", task: "Wiring inspection", date: "2026-04-28", amount: 5200, status: "Completed" },
  { id: "j4", customer: "Ayesha K.", task: "Fuse replacement", date: "2026-04-22", amount: 1200, status: "Completed" },
];

const incoming = [
  { id: "b1", customer: "Bilal Khan", task: "Bathroom light fittings", bid: 4500 },
  { id: "b2", customer: "Sara M.", task: "Outdoor LED setup", bid: 7200 },
];

function WorkerDashboard() {
  const { session, workers, logout, urgentBids, acceptUrgentBid, updateWorkerProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session.role !== "worker") navigate({ to: "/login" });
  }, [session, navigate]);

  const me = workers.find((w) => w.username === session?.username);
  const earnings = me?.earnings ?? 0;
  const totalEarned = earnings + recentJobs.reduce((s, j) => s + j.amount, 0);
  const openBids = urgentBids.filter((b) => b.status === "open");
  const myAccepted = urgentBids.filter((b) => b.acceptedBy === session?.username);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name ?? "");
  const [trades, setTrades] = useState<string[]>(me?.trades ?? (me?.trade ? [me.trade] : []));
  const [country, setCountry] = useState(me?.country ?? "");
  const MAX_TRADES = 5;

  useEffect(() => {
    if (me) {
      setName(me.name);
      setTrades(me.trades && me.trades.length ? me.trades : me.trade ? [me.trade] : []);
      setCountry(me.country);
    }
  }, [me]);

  const toggleTrade = (t: string) => {
    setTrades((cur) => {
      if (cur.includes(t)) return cur.filter((x) => x !== t);
      if (cur.length >= MAX_TRADES) return cur;
      return [...cur, t];
    });
  };

  const saveProfile = () => {
    if (!session) return;
    if (trades.length === 0) return;
    updateWorkerProfile(session.username, { name, trades, trade: trades[0], country });
    setEditing(false);
  };
  const myTrades = me?.trades && me.trades.length ? me.trades : me?.trade ? [me.trade] : [];

  return (
    <ToolsBackground overlay="bg-navy/75">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-black text-brand">Worker Dashboard</h1>
            <p className="text-white/70">Welcome back, <span className="text-white font-semibold">{me?.name ?? session?.username}</span></p>
          </div>
          <button onClick={() => { logout(); navigate({ to: "/" }); }} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-white hover:bg-white/25 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {me?.blocked && (
          <div className="mt-6 rounded-xl bg-destructive/30 p-4 text-white">⚠ Your account has been blocked by admin. Contact support.</div>
        )}

        {/* Profile card */}
        <div className="mt-8 rounded-2xl bg-card p-6 animate-float-up">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                  {me?.name ?? "—"}
                  {me?.verified && <BadgeCheck className="h-5 w-5 text-brand" />}
                </h2>
                <p className="text-white/70">{me?.trade} • {me?.country}</p>
                <p className="text-xs text-white/50">@{session?.username}</p>
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:scale-105 transition">
                <Pencil className="h-4 w-4" /> Edit profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveProfile} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Save</button>
                <button onClick={() => setEditing(false)} className="rounded-full bg-white/15 px-4 py-2 text-sm text-white">Cancel</button>
              </div>
            )}
          </div>
          {editing && (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Input label="Full name" value={name} onChange={setName} />
              <Input label="Trade" value={trade} onChange={setTrade} />
              <Input label="Country" value={country} onChange={setCountry} />
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<Wallet className="h-6 w-6" />} label="Total earned" value={`PKR ${totalEarned.toLocaleString()}`} />
          <Stat icon={<Briefcase className="h-6 w-6" />} label="Jobs done" value={recentJobs.length.toString()} />
          <Stat icon={<ClipboardList className="h-6 w-6" />} label="Pending bids" value={incoming.length.toString()} />
          <Stat icon={<Star className="h-6 w-6" />} label="Rating" value="4.8" />
        </div>

        {/* Universal urgent bids */}
        <div className="mt-10">
          <Panel title={`Urgent job board (${openBids.length} open)`} icon={<Megaphone className="h-5 w-5 text-brand" />}>
            {openBids.length === 0 ? (
              <p className="text-white/60 text-sm">No open jobs right now. Check back soon.</p>
            ) : (
              <div className="space-y-3">
                {openBids.map((b) => (
                  <div key={b.id} className="rounded-xl bg-navy/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{b.trade}</span>
                        <p className="mt-1 font-semibold text-white">{b.title}</p>
                        <p className="text-sm text-white/70">{b.description}</p>
                        <p className="mt-1 text-xs text-white/50 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{b.location} • {b.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-brand">PKR {b.budget.toLocaleString()}</p>
                        <button onClick={() => acceptUrgentBid(b.id, session!.username)}
                          className="mt-2 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground hover:scale-105 transition">
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Panel title="Incoming direct bids" icon={<ClipboardList className="h-5 w-5 text-brand" />}>
            <div className="space-y-3">
              {incoming.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl bg-navy/60 p-4">
                  <div>
                    <p className="font-semibold text-white">{b.customer}</p>
                    <p className="text-sm text-white/70">{b.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand">PKR {b.bid}</p>
                    <div className="mt-1 flex gap-2">
                      <button className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">Accept</button>
                      <button className="rounded-full bg-white/15 px-3 py-1 text-xs text-white">Decline</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Earnings — last 30 days" icon={<Wallet className="h-5 w-5 text-brand" />}>
            <div className="text-5xl font-black text-brand">PKR {totalEarned.toLocaleString()}</div>
            <p className="mt-1 text-sm text-white/70">Across {recentJobs.length} completed jobs</p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => {
                const h = 30 + Math.round(Math.sin(i * 1.3) * 25 + Math.random() * 30);
                return <div key={i} className="rounded bg-brand/70" style={{ height: `${h}px` }} />;
              })}
            </div>
          </Panel>
        </div>

        <div className="mt-10">
          <Panel title="Job history" icon={<History className="h-5 w-5 text-brand" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white">
                <thead className="text-white/60">
                  <tr><th className="py-2">Date</th><th>Customer</th><th>Task</th><th>Status</th><th className="text-right">Amount</th></tr>
                </thead>
                <tbody>
                  {[...myAccepted.map((b) => ({ id: b.id, date: new Date(b.createdAt).toISOString().slice(0,10), customer: b.customer, task: b.title, status: "Accepted", amount: b.budget })), ...recentJobs].map((j) => (
                    <tr key={j.id} className="border-t border-white/10">
                      <td className="py-3">{j.date}</td>
                      <td>{j.customer}</td>
                      <td>{j.task}</td>
                      <td><span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs text-brand">{j.status}</span></td>
                      <td className="text-right font-semibold">PKR {j.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="mt-8 text-center">
          <Link to="/home" className="text-brand hover:underline">Browse the customer view</Link>
        </div>
      </div>
    </ToolsBackground>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 animate-float-up">
      <div className="flex items-center gap-3 text-brand">{icon}<span className="text-sm text-white/70">{label}</span></div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-6 animate-float-up">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">{icon} {title}</h3>
      {children}
    </div>
  );
}
function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white/80">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-navy/60 p-2.5 text-white outline-none" />
    </label>
  );
}
