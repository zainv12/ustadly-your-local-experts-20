import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { COUNTRIES, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Sign up — Ustaadly" }] }),
});

function Signup() {
  const { signupCustomer } = useAuth();
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", cnic: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!country) return setError("Please select your country");
    if (!form.username || !form.password) return setError("Username and password are required");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    const res = signupCustomer({
      country, name: form.name, phone: form.phone, email: form.email, cnic: form.cnic,
      username: form.username, password: form.password,
    });
    if (!res.ok) return setError(res.error || "Signup failed");
    navigate({ to: "/home" });
  };

  return (
    <ToolsBackground overlay="bg-navy/70">
      <form onSubmit={submit} className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
        <h1 className="text-center font-display text-5xl font-black text-brand text-shadow-glow">Create account</h1>
        {error && <p className="text-center text-destructive">{error}</p>}

        <label className="block">
          <span className="mb-2 block text-center text-sm text-white/80">Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white outline-none"
          >
            <option value="" className="text-navy">Select your country…</option>
            {COUNTRIES.map((c) => <option key={c} value={c} className="text-navy">{c}</option>)}
          </select>
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={update("name")} />
          <Field label="Phone #" value={form.phone} onChange={update("phone")} />
          <Field label="E-mail" type="email" value={form.email} onChange={update("email")} />
          <Field label="CNIC / ID" value={form.cnic} onChange={update("cnic")} />
          <Field label="Username" value={form.username} onChange={update("username")} />
          <Field label="New Password" type="password" value={form.password} onChange={update("password")} />
          <Field label="Confirm Password" type="password" value={form.confirm} onChange={update("confirm")} />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Link to="/login" className="text-white/80 hover:text-white">Already have an account?</Link>
          <button type="submit" className="input-glow rounded-full bg-brand px-12 py-3 font-semibold text-brand-foreground transition hover:scale-105">
            Create account
          </button>
        </div>
      </form>
    </ToolsBackground>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-center text-sm text-white/80">{label}</span>
      <input {...rest} className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/60 outline-none focus:bg-white/40 transition" />
    </label>
  );
}
