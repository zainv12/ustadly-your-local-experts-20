import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, User, MessageSquareWarning, Megaphone, Moon, Sun, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const links = [
  { to: "/home", label: "Home" },
  { to: "/post-job", label: "Post a job" },
  { to: "/history", label: "History" },
  { to: "/complaints", label: "Complaints" },
  { to: "/about", label: "About Us" },
] as const;

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { session, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onLogout = () => { logout(); setOpen(false); navigate({ to: "/" }); };

  return (
    <header className="sticky top-0 z-30 w-full" style={{ backgroundColor: "var(--header)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:py-4">
        <Link to="/home" className="font-display text-2xl font-black text-brand sm:text-3xl md:text-4xl">
          Ustaadly<span className="text-brand">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link key={l.to} to={l.to}
                className={`relative text-base font-semibold transition-colors ${active ? "text-navy" : "text-navy/70 hover:text-navy"}`}>
                {l.label === "Complaints" ? <span className="inline-flex items-center gap-1"><MessageSquareWarning className="h-4 w-4" />{l.label}</span>
                  : l.label === "Post a job" ? <span className="inline-flex items-center gap-1"><Megaphone className="h-4 w-4" />{l.label}</span>
                  : l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand transition-all duration-300 ${active ? "w-full" : "w-0"}`} />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggle}
            className="rounded-full p-2 text-navy transition hover:bg-navy/10"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/profile" className="hidden rounded-full p-2 text-navy hover:bg-navy/10 transition sm:inline-flex" aria-label="Profile">
            <User className="h-6 w-6" />
          </Link>
          {session ? (
            <button onClick={onLogout} className="hidden rounded-full p-2 text-navy hover:bg-navy/10 transition sm:inline-flex" aria-label="Logout" title={`Logout (${session.username})`}>
              <LogOut className="h-6 w-6" />
            </button>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/10 transition sm:inline-flex">Login</Link>
              <Link to="/signup" className="hidden rounded-full bg-navy px-4 py-2 text-sm font-semibold text-brand hover:scale-105 transition sm:inline-flex">Sign up</Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-navy transition hover:bg-navy/10 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="grid gap-1 py-3">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-brand/20 text-navy" : "text-navy/75 hover:bg-navy/10 hover:text-navy"}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
            <Link to="/profile" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-navy">
              <User className="h-4 w-4" /> Profile
            </Link>
            {session ? (
              <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-navy">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-navy">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-brand">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
