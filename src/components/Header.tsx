import { Link, useRouterState } from "@tanstack/react-router";
import { User } from "lucide-react";

const links = [
  { to: "/home", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/urgent", label: "Urgent" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About Us" },
] as const;

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-30 w-full" style={{ backgroundColor: "var(--header)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/home" className="font-display text-3xl md:text-4xl font-black text-brand">
          Ustaadly<span className="text-brand">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-base font-semibold transition-colors ${active ? "text-navy" : "text-navy/70 hover:text-navy"}`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand transition-all duration-300 ${active ? "w-full" : "w-0"}`} />
              </Link>
            );
          })}
        </nav>
        <Link to="/profile" className="rounded-full p-2 text-navy hover:bg-navy/10 transition">
          <User className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
