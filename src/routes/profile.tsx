import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolsBackground } from "@/components/ToolsBackground";
import { useAuth, COUNTRIES, type Customer } from "@/lib/auth";
import { User, Pencil, ShieldCheck, LogOut, Lock } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — Ustaadly" }] }),
});

function Profile() {
  const { session, customers, logout, updateCustomerProfile } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div>
        <Header />
        <ToolsBackground overlay="bg-navy/70">
          <div className="mx-auto max-w-md px-6 py-16 text-center">
            <h1 className="font-display text-4xl font-black text-white">Your Profile</h1>
            <p className="mt-4 text-white/80">Sign in to see your bookings and saved pros.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/login" className="rounded-full bg-brand px-8 py-3 font-semibold text-brand-foreground hover:scale-105 transition">Login</Link>
              <Link to="/signup" className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10 transition">Sign up</Link>
            </div>
          </div>
        </ToolsBackground>
        <Footer />
      </div>
    );
  }

  if (session.role === "customer") {
    const me = customers.find((c) => c.username === session.username);
    return (
      <div>
        <Header />
        <ToolsBackground overlay="bg-navy/75">
          <CustomerProfile me={me} onSave={(p) => updateCustomerProfile(session.username, p)} onLogout={() => { logout(); navigate({ to: "/" }); }} />
        </ToolsBackground>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <ToolsBackground overlay="bg-navy/70">
        <div className="mx-auto max-w-md px-6 py-16 text-center text-white">
          <h1 className="font-display text-4xl font-black">Logged in as @{session.username}</h1>
          <p className="mt-2 text-white/70">Role: {session.role}</p>
          <div className="mt-6 flex justify-center gap-3">
            {session.role === "worker" && <Link to="/worker" className="rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground">Worker dashboard</Link>}
            {session.role === "admin" && <Link to="/admin" className="rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground">Admin panel</Link>}
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="rounded-full bg-white/15 px-6 py-2.5 text-white">Logout</button>
          </div>
        </div>
      </ToolsBackground>
      <Footer />
    </div>
  );
}

function CustomerProfile({
  me, onSave, onLogout,
}: { me?: Customer; onSave: (p: Partial<Customer>) => void; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Customer | null>(null);

  useEffect(() => { if (me) setForm({ ...me }); }, [me]);

  if (!me || !form) return <div className="p-12 text-white">Loading…</div>;

  const set = <K extends keyof Customer>(k: K, v: Customer[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const save = () => {
    onSave({
      name: form.name, email: form.email, phone: form.phone, country: form.country,
      cnic: form.cnic, address: form.address, dob: form.dob,
      emergencyContact: form.emergencyContact, notes: form.notes,
    });
    setEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-black text-brand">My account</h1>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-white hover:bg-white/25 transition">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-card p-6 animate-float-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{me.name || me.username}</h2>
              <p className="text-white/70">@{me.username} · {me.country}</p>
            </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:scale-105 transition">
              <Pencil className="h-4 w-4" /> Edit profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={save} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Save</button>
              <button onClick={() => { setForm({ ...me }); setEditing(false); }} className="rounded-full bg-white/15 px-4 py-2 text-sm text-white">Cancel</button>
            </div>
          )}
        </div>

        <Section title="Public info" subtitle="Workers see this when you hire them.">
          <Grid>
            <F label="Name" value={form.name} onChange={(v) => set("name", v)} editing={editing} />
            <F label="Country" value={form.country} onChange={(v) => set("country", v)} editing={editing} as="select" options={COUNTRIES} />
          </Grid>
        </Section>

        <Section title="Contact" subtitle="Shared only with workers you hire.">
          <Grid>
            <F label="Phone" value={form.phone} onChange={(v) => set("phone", v)} editing={editing} />
            <F label="Email" value={form.email} onChange={(v) => set("email", v)} editing={editing} />
          </Grid>
        </Section>

        <Section title="Private info" subtitle="Never shared with workers. For your records & support only." privateInfo>
          <Grid>
            <F label="CNIC / ID" value={form.cnic} onChange={(v) => set("cnic", v)} editing={editing} privateInfo />
            <F label="Date of birth" value={form.dob ?? ""} onChange={(v) => set("dob", v)} editing={editing} privateInfo type="date" />
            <F label="Home address" value={form.address ?? ""} onChange={(v) => set("address", v)} editing={editing} privateInfo />
            <F label="Emergency contact" value={form.emergencyContact ?? ""} onChange={(v) => set("emergencyContact", v)} editing={editing} privateInfo />
          </Grid>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-white/70 inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Personal notes (private)</label>
            {editing ? (
              <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full rounded-xl bg-navy/60 p-3 text-white outline-none" />
            ) : (
              <p className="rounded-xl bg-navy/40 p-3 text-white/85 text-sm">{form.notes || <span className="text-white/40">— none —</span>}</p>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, privateInfo }: { title: string; subtitle?: string; children: React.ReactNode; privateInfo?: boolean }) {
  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-white">
        {privateInfo ? <Lock className="h-4 w-4 text-brand" /> : <ShieldCheck className="h-4 w-4 text-brand" />}
        {title}
      </h3>
      {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) { return <div className="grid gap-4 sm:grid-cols-2">{children}</div>; }
function F({
  label, value, onChange, editing, type = "text", as, options, privateInfo,
}: {
  label: string; value: string; onChange: (v: string) => void; editing: boolean;
  type?: string; as?: "select"; options?: readonly string[]; privateInfo?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/70 inline-flex items-center gap-1">
        {privateInfo && <Lock className="h-3 w-3" />} {label}
      </span>
      {editing ? (
        as === "select" ? (
          <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-navy/60 p-2.5 text-white outline-none">
            {options?.map((o) => <option key={o} value={o} className="text-navy">{o}</option>)}
          </select>
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-navy/60 p-2.5 text-white outline-none" />
        )
      ) : (
        <p className="rounded-lg bg-navy/40 p-2.5 text-white">{value || <span className="text-white/40">—</span>}</p>
      )}
    </label>
  );
}
