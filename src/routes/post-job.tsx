import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";
import { categories } from "@/data/professionals";
import { Megaphone } from "lucide-react";

export const Route = createFileRoute("/post-job")({
  component: PostJob,
  head: () => ({ meta: [{ title: "Post a job — Ustaadly" }] }),
});

function PostJob() {
  const { session, postUrgentBid } = useAuth();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<string>(categories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number>(2000);
  const [location, setLocation] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = session?.username ?? "Guest";
    postUrgentBid({ customer, trade, title, description, budget: Number(budget) || 0, location });
    setDone(true);
    setTimeout(() => navigate({ to: "/urgent" }), 900);
  };

  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/75">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="font-display text-5xl font-black text-brand inline-flex items-center gap-3">
            <Megaphone className="h-9 w-9" /> Post a job
          </h1>
          <p className="mt-2 text-white/80">Broadcast an urgent job. Any qualified worker can accept the bid.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-card p-6">
            <Field label="Trade needed">
              <select value={trade} onChange={(e) => setTrade(e.target.value)} className="w-full rounded-lg bg-navy/60 p-3 text-white outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Job title">
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Fix leaking kitchen sink"
                className="w-full rounded-lg bg-navy/60 p-3 text-white outline-none" />
            </Field>
            <Field label="Description">
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Describe the work in detail..."
                className="w-full rounded-lg bg-navy/60 p-3 text-white outline-none" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bid (PKR)">
                <input required type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full rounded-lg bg-navy/60 p-3 text-white outline-none" />
              </Field>
              <Field label="Location">
                <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, area"
                  className="w-full rounded-lg bg-navy/60 p-3 text-white outline-none" />
              </Field>
            </div>
            <button type="submit" className="w-full rounded-full bg-brand px-6 py-3 font-bold text-brand-foreground hover:scale-[1.02] transition">
              {done ? "Posted ✓ Redirecting..." : "Broadcast bid"}
            </button>
          </form>
        </div>
      </ToolsBackground>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white/80">{label}</span>
      {children}
    </label>
  );
}
