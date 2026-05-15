import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, MapPin, Send, Gavel } from "lucide-react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { professionals } from "@/data/professionals";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/professional/$id")({
  component: ProfessionalPage,
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Ustaadly` }] }),
});

type Msg = { from: "you" | "pro"; text: string; time: string };

function ProfessionalPage() {
  const { id } = useParams({ from: "/professional/$id" });
  const pro = professionals.find((p) => p.id === id);
  const { session, addHire } = useAuth();

  const [bid, setBid] = useState("");
  const [bidNote, setBidNote] = useState("");
  const [bidSent, setBidSent] = useState<{ amount: string; note: string } | null>(null);

  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "pro", text: `Hi! I'm ${pro?.name ?? "your worker"}. How can I help?`, time: "now" },
  ]);
  const [draft, setDraft] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locErr, setLocErr] = useState("");

  if (!pro) {
    return (
      <ToolsBackground>
        <div className="p-12 text-white">Professional not found. <Link to="/home" className="text-brand underline">Back home</Link></div>
      </ToolsBackground>
    );
  }

  const sendMsg = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs((m) => [...m, { from: "you", text: draft, time }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "pro", text: "Thanks, I'll get back to you shortly.", time }]);
    }, 800);
  };

  const shareLoc = () => {
    setLocErr("");
    if (!navigator.geolocation) { setLocErr("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const loc = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLocation(loc);
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMsgs((m) => [...m, { from: "you", text: `📍 Shared location: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, time }]);
      },
      () => setLocErr("Permission denied"),
    );
  };

  const submitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid) return;
    setBidSent({ amount: bid, note: bidNote });
    if (pro && session?.role === "customer") {
      addHire({ customer: session.username, workerName: pro.name, workerId: pro.id, trade: pro.trade });
    }
    setBid(""); setBidNote("");
  };

  const isCustomer = session?.role === "customer";

  return (
    <ToolsBackground overlay="bg-navy/60">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/home" className="inline-flex items-center gap-1 rounded-full bg-navy/60 p-3 text-brand transition hover:scale-110">
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[320px_1fr]">
          <div className="animate-float-up">
            <img src={pro.photo} alt={pro.name} width={320} height={320} className="aspect-square w-full rounded-2xl object-cover shadow-2xl" />
          </div>

          <div className="rounded-2xl bg-card p-8 animate-float-up delay-100">
            <h1 className="text-3xl font-bold text-white">{pro.name}</h1>
            <h2 className="mt-1 text-2xl font-bold text-white">Certified {pro.trade}</h2>
            <Section title="About Me">{pro.about}</Section>
            <Section title="Contact">
              <ul className="list-disc pl-5 space-y-1">
                <li>Phone: {pro.phone}</li>
                <li>Email: {pro.email}</li>
                <li>Location: {pro.location}</li>
              </ul>
            </Section>
            <Section title="Education">
              <p className="font-semibold">{pro.education}</p>
              <p className="text-white/80">{pro.educationDetail}</p>
            </Section>
            <Section title="Languages">
              <ul className="list-disc pl-5">{pro.languages.map((l) => <li key={l}>{l}</li>)}</ul>
            </Section>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Bid */}
          <div className="rounded-2xl bg-card p-8 animate-float-up">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white"><Gavel className="h-6 w-6 text-brand" /> Offer your bid</h3>
            <p className="mt-2 text-sm text-white/70">Propose a price for the job. The worker will accept, decline, or counter.</p>
            {!isCustomer && <p className="mt-2 text-xs text-brand">Login as customer to send a bid.</p>}
            <form onSubmit={submitBid} className="mt-4 space-y-3">
              <input type="number" min="1" placeholder="Bid amount (PKR)" value={bid} onChange={(e) => setBid(e.target.value)}
                disabled={!isCustomer} className="w-full rounded-full bg-navy/60 px-5 py-3 text-white outline-none disabled:opacity-50" />
              <textarea placeholder="Job description (optional)" value={bidNote} onChange={(e) => setBidNote(e.target.value)}
                disabled={!isCustomer} rows={3} className="w-full rounded-2xl bg-navy/60 px-5 py-3 text-white outline-none disabled:opacity-50" />
              <button disabled={!isCustomer} className="rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground hover:scale-105 transition disabled:opacity-50">
                Send bid
              </button>
            </form>
            {bidSent && (
              <div className="mt-4 rounded-xl bg-brand/20 p-4 text-sm text-white">
                ✅ Bid of <strong>PKR {bidSent.amount}</strong> sent to {pro.name}.
              </div>
            )}
          </div>

          {/* Chat + location */}
          <div className="rounded-2xl bg-card p-8 animate-float-up delay-100 flex flex-col">
            <h3 className="text-2xl font-bold text-white">Chat with {pro.name.split(" ")[0]}</h3>
            <div className="mt-4 flex-1 min-h-[240px] max-h-[320px] overflow-y-auto rounded-xl bg-navy/60 p-4 space-y-2">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.from === "you" ? "bg-brand text-brand-foreground" : "bg-white/15 text-white"}`}>
                    <div>{m.text}</div>
                    <div className="mt-0.5 text-[10px] opacity-70">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {location && (
              <div className="mt-2 flex items-center gap-2 text-xs text-brand">
                <MapPin className="h-4 w-4" /> Location shared: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
              </div>
            )}
            {locErr && <p className="mt-2 text-xs text-destructive">{locErr}</p>}
            <div className="mt-3 flex gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                placeholder="Type a message…" className="flex-1 rounded-full bg-navy/60 px-5 py-2.5 text-white outline-none" />
              <button onClick={shareLoc} title="Share location" className="rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25 transition">
                <MapPin className="h-5 w-5" />
              </button>
              <button onClick={sendMsg} className="rounded-full bg-brand p-2.5 text-brand-foreground hover:scale-105 transition">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-md rounded-2xl bg-card p-8 animate-float-up delay-200">
          <h3 className="text-3xl font-bold text-white">Reviews</h3>
          <div className="mt-6 rounded-xl bg-navy/60 p-6 text-center text-white/80">No Reviews</div>
        </div>
      </div>
    </ToolsBackground>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-2 text-white/85 leading-relaxed">{children}</div>
    </div>
  );
}
