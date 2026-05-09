import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolsBackground } from "@/components/ToolsBackground";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Sign up — Ustaadly" }] }),
});

const fields = [
  ["Name", "Phone #"],
  ["E-mail", "CNIC"],
  ["New Password", "Confirm password"],
] as const;

function Signup() {
  return (
    <ToolsBackground overlay="bg-navy/70">
      <form className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
        {fields.map((row, ri) => (
          <div key={ri} className="grid gap-6 sm:grid-cols-2 animate-float-up" style={{ animationDelay: `${ri * 100}ms` }}>
            {row.map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-center text-sm text-white/80">{label}</span>
                <input
                  type={label.toLowerCase().includes("password") ? "password" : "text"}
                  className="input-glow w-full rounded-full bg-white/30 px-6 py-3 text-white placeholder-white/60 outline-none focus:bg-white/40 transition"
                />
              </label>
            ))}
          </div>
        ))}

        <div className="flex flex-col items-center gap-4 animate-float-up delay-300">
          <Link to="/login" className="text-white/80 hover:text-white">Already have an account?</Link>
          <button type="submit" className="input-glow rounded-full bg-white/30 px-12 py-3 font-semibold text-white transition hover:scale-105 hover:bg-white/40">
            Continue
          </button>
        </div>
      </form>
    </ToolsBackground>
  );
}
