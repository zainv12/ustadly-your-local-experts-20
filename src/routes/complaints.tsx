import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth } from "@/lib/auth";
import { professionals } from "@/data/professionals";
import { MessageSquareWarning, CheckCircle2, Lightbulb, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/complaints")({
  component: Complaints,
  head: () => ({ meta: [{ title: "Complaint Center — Ustaadly" }] }),
});

function Complaints() {
  const { session, fileComplaint, complaints, suggestions, addSuggestion } = useAuth();
  const [against, setAgainst] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const [sugKind, setSugKind] = useState<"suggestion" | "feedback">("suggestion");
  const [sugMsg, setSugMsg] = useState("");
  const [sugSent, setSugSent] = useState(false);
  const sugRef = useRef<HTMLDivElement>(null);

  const mine = session ? complaints.filter((c) => c.from === session.username) : [];
  const recentSug = suggestions.slice(0, 6);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!against || !subject || !message) return;
    fileComplaint({ from: session.username, against, subject, message });
    setSent(true);
    setSubject(""); setMessage(""); setAgainst("");
    setTimeout(() => setSent(false), 3000);
  };

  const submitSug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugMsg.trim()) return;
    addSuggestion({ from: session?.username ?? "guest", kind: sugKind, message: sugMsg.trim() });
    setSugMsg("");
    setSugSent(true);
    setTimeout(() => setSugSent(false), 3000);
  };

  const scrollToFeedback = (kind: "suggestion" | "feedback") => {
    setSugKind(kind);
    sugRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/75">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-black text-brand inline-flex items-center gap-3">
                <MessageSquareWarning /> Complaint Center
              </h1>
              <p className="mt-1 text-white/70">Report an issue, suggest improvements, or share feedback.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollToFeedback("suggestion")} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:scale-105 transition">
                <Lightbulb className="h-4 w-4" /> Suggest
              </button>
              <button onClick={() => scrollToFeedback("feedback")} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition">
                <MessageCircle className="h-4 w-4" /> Feedback
              </button>
            </div>
          </div>

          {!session ? (
            <div className="mt-8 rounded-2xl bg-card p-6 text-white">
              Please <Link to="/login" className="text-brand underline">login</Link> to file a complaint. (You can still send suggestions or feedback below.)
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 rounded-2xl bg-card p-6 space-y-4 animate-float-up">
              <div>
                <label className="mb-1 block text-sm text-white/80">Worker</label>
                <select value={against} onChange={(e) => setAgainst(e.target.value)} className="w-full rounded-full bg-navy/60 px-5 py-3 text-white outline-none">
                  <option value="">Select a worker…</option>
                  {professionals.map((p) => <option key={p.id} value={p.name} className="text-navy">{p.name} — {p.trade}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-full bg-navy/60 px-5 py-3 text-white outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Describe the issue</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full rounded-2xl bg-navy/60 px-5 py-3 text-white outline-none" />
              </div>
              <button className="rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground hover:scale-105 transition">
                Submit complaint
              </button>
              {sent && <p className="inline-flex items-center gap-2 text-brand"><CheckCircle2 className="h-4 w-4" /> Submitted to admin.</p>}
            </form>
          )}

          {mine.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-white">Your complaints</h2>
              <div className="mt-4 space-y-3">
                {mine.slice().sort((a, b) => b.createdAt - a.createdAt).map((c) => (
                  <div key={c.id} className="rounded-xl bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{c.subject}</p>
                      <span className={`rounded-full px-3 py-1 text-xs ${c.status === "open" ? "bg-destructive/30 text-white" : "bg-brand/20 text-brand"}`}>{c.status}</span>
                    </div>
                    <p className="text-xs text-white/60">Against {c.against} · {new Date(c.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-white/85">{c.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions & feedback */}
          <div ref={sugRef} className="mt-12">
            <h2 className="text-2xl font-bold text-white inline-flex items-center gap-2">
              <Lightbulb className="text-brand" /> Suggestions & feedback
            </h2>
            <p className="mt-1 text-sm text-white/70">Help us improve Ustaadly. We read every note.</p>

            <form onSubmit={submitSug} className="mt-4 rounded-2xl bg-card p-6 space-y-4 animate-float-up">
              <div className="flex gap-2">
                <button type="button" onClick={() => setSugKind("suggestion")}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${sugKind === "suggestion" ? "bg-brand text-brand-foreground" : "bg-white/15 text-white"}`}>
                  💡 Suggestion
                </button>
                <button type="button" onClick={() => setSugKind("feedback")}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${sugKind === "feedback" ? "bg-brand text-brand-foreground" : "bg-white/15 text-white"}`}>
                  💬 Feedback
                </button>
              </div>
              <textarea
                value={sugMsg}
                onChange={(e) => setSugMsg(e.target.value)}
                rows={4}
                placeholder={sugKind === "suggestion" ? "What feature should we add?" : "Tell us how we're doing…"}
                className="w-full rounded-2xl bg-navy/60 px-5 py-3 text-white outline-none"
              />
              <button className="rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground hover:scale-105 transition">
                Send {sugKind}
              </button>
              {sugSent && <p className="inline-flex items-center gap-2 text-brand"><CheckCircle2 className="h-4 w-4" /> Thanks — sent!</p>}
            </form>

            {recentSug.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Recent community notes</h3>
                {recentSug.map((s) => (
                  <div key={s.id} className="rounded-xl bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-3 py-1 text-xs ${s.kind === "suggestion" ? "bg-brand/20 text-brand" : "bg-white/15 text-white"}`}>
                        {s.kind}
                      </span>
                      <span className="text-xs text-white/50">{new Date(s.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/85">{s.message}</p>
                    <p className="mt-1 text-xs text-white/50">— @{s.from}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ToolsBackground>
      <Footer />
    </div>
  );
}
