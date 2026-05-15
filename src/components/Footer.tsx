import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquareWarning, Megaphone, Info, ShieldCheck, ChevronDown } from "lucide-react";

export function Footer() {
  const [openAbout, setOpenAbout] = useState(false);
  return (
    <footer className="bg-navy text-white/80 mt-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-black text-brand">Ustaadly<span className="text-brand">.</span></h3>
          <p className="mt-3 text-sm leading-relaxed">
            Hire trusted local professionals — electricians, plumbers, doctors, teachers and more.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/home" className="hover:text-brand transition">Home</Link></li>
            <li><Link to="/search" className="hover:text-brand transition">Search professionals</Link></li>
            <li><Link to="/urgent" className="hover:text-brand transition"><Megaphone className="inline h-3.5 w-3.5 mr-1" />Urgent jobs</Link></li>
            <li><Link to="/post-job" className="hover:text-brand transition">Post a job</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => setOpenAbout((v) => !v)}
                className="inline-flex items-center gap-1 hover:text-brand transition"
                aria-expanded={openAbout}
              >
                <Info className="inline h-3.5 w-3.5" />About us
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openAbout ? "rotate-180" : ""}`} />
              </button>
              {openAbout && (
                <ul className="mt-2 ml-5 space-y-1.5 border-l border-white/10 pl-3 text-xs">
                  <li>
                    <Link
                      to="/about"
                      onClick={() => requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
                      className="hover:text-brand transition"
                    >
                      Our story
                    </Link>
                  </li>
                  <li><Link to="/about" className="hover:text-brand transition">Mission & values</Link></li>
                  <li><Link to="/about" className="hover:text-brand transition">How it works</Link></li>
                  <li><Link to="/about" className="hover:text-brand transition">Team</Link></li>
                  <li><Link to="/complaints" className="hover:text-brand transition">Contact us</Link></li>
                </ul>
              )}
            </li>
            <li><Link to="/complaints" className="hover:text-brand transition"><MessageSquareWarning className="inline h-3.5 w-3.5 mr-1" />Complaints & feedback</Link></li>
            <li><Link to="/profile" className="hover:text-brand transition">My account</Link></li>
            <li><span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-brand" />Privacy protected</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> hello@ustaadly.pk</li>
            <li className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> +92 300 0000000</li>
            <li className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-8 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Ustaadly. All rights reserved.
      </div>
    </footer>
  );
}
