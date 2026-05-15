import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { professionals } from "@/data/professionals";
import { useAuth } from "@/lib/auth";
import { MapPin, Clock, Megaphone, CheckCircle2, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/urgent")({
  component: Urgent,
  head: () => ({ meta: [{ title: "Urgent help — Ustaadly" }] }),
});

function Urgent() {
  const { urgentBids, session, acceptUrgentBid } = useAuth();
  const top = professionals.filter((p) => p.rating >= 4);
  const isWorker = session?.role === "worker";
  const open = urgentBids.filter((b) => b.status === "open");
  const taken = urgentBids.filter((b) => b.status === "accepted");

  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl font-black text-brand animate-shimmer">Urgent</h1>
              <p className="mt-3 text-white/80">Live job board — workers can claim a bid instantly.</p>
            </div>
            <Link to="/post-job" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 font-semibold text-brand-foreground hover:scale-105 transition">
              <Megaphone className="h-4 w-4" /> Post a job
            </Link>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-white">Open bids ({open.length})</h2>
            {open.length === 0 ? (
              <p className="mt-3 text-white/60">No open bids right now. Be the first to <Link to="/post-job" className="text-brand underline">post one</Link>.</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {open.map((b) => (
                  <div key={b.id} className="rounded-2xl bg-card p-5 animate-float-up">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{b.trade}</span>
                        <h3 className="mt-2 text-lg font-bold text-white">{b.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-brand">PKR {b.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-white/80">{b.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/60">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{b.location}</span>
                      {b.neededAt && (
                        <span className="inline-flex items-center gap-1 text-brand"><CalendarClock className="h-3 w-3" />Needed {new Date(b.neededAt).toLocaleString()}</span>
                      )}
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(b.createdAt).toLocaleString()}</span>
                      <span>by <span className="text-white/80">{b.customer}</span></span>
                    </div>
                    {isWorker ? (
                      <button onClick={() => acceptUrgentBid(b.id, session!.username)}
                        className="mt-4 w-full rounded-full bg-brand px-4 py-2 font-semibold text-brand-foreground hover:scale-[1.02] transition">
                        Accept bid
                      </button>
                    ) : (
                      <p className="mt-4 text-xs text-white/50">Login as a worker to accept this bid.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {taken.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white">Recently accepted</h2>
              <div className="mt-4 space-y-2">
                {taken.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl bg-navy/60 p-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />{b.title} <span className="text-white/50">— {b.trade}</span></span>
                    <span className="text-brand font-semibold">{b.acceptedBy}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14">
            <h2 className="text-2xl font-bold text-white">Top-rated pros available now</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {top.map((p, i) => (
                <div key={p.id} className="animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ProfessionalCard pro={p} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </ToolsBackground>
    </div>
  );
}
