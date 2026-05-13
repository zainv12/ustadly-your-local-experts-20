import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, User, MessageSquareWarning, Megaphone } from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/home", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/urgent", label: "Urgent" },
  { to: "/post-job", label: "Post a job" },
  { to: "/history", label: "History" },
  { to: "/complaints", label: "Complaints" },
  { to: "/about", label: "About Us" },
] as const;

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => { logout(); navigate({ to: "/" }); };

  return (
    <header className="sticky top-0 z-30 w-full" style={{ backgroundColor: "var(--header)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/home" className="font-display text-3xl md:text-4xl font-black text-brand">
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
        <div className="flex items-center gap-2">
          <Link to="/profile" className="rounded-full p-2 text-navy hover:bg-navy/10 transition" aria-label="Profile">
            <User className="h-6 w-6" />
          </Link>
          {session ? (
            <button onClick={onLogout} className="rounded-full p-2 text-navy hover:bg-navy/10 transition" aria-label="Logout" title={`Logout (${session.username})`}>
              <LogOut className="h-6 w-6" />
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/10 transition">Login</Link>
              <Link to="/signup" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-brand hover:scale-105 transition">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
