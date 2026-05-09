import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";
import { Wallet, Briefcase, History, Star, LogOut, ClipboardList } from "lucide-react";

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
  const { session, workers, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session.role !== "worker") navigate({ to: "/login" });
  }, [session, navigate]);

  const me = workers.find((w) => w.username === session?.username);
  const earnings = me?.earnings ?? 0;
  const totalEarned = earnings + recentJobs.reduce((s, j) => s + j.amount, 0);

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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<Wallet className="h-6 w-6" />} label="Total earned" value={`PKR ${totalEarned.toLocaleString()}`} />
          <Stat icon={<Briefcase className="h-6 w-6" />} label="Jobs done" value={recentJobs.length.toString()} />
          <Stat icon={<ClipboardList className="h-6 w-6" />} label="Pending bids" value={incoming.length.toString()} />
          <Stat icon={<Star className="h-6 w-6" />} label="Rating" value="4.8" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Panel title="Incoming bids" icon={<ClipboardList className="h-5 w-5 text-brand" />}>
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
                  {recentJobs.map((j) => (
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
