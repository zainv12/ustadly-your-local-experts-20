import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "customer" | "worker" | "admin";

export type Customer = {
  username: string; password: string;
  name: string; email: string; phone: string; cnic: string; country: string;
  /** private — never shown to workers when hiring */
  address?: string; dob?: string; emergencyContact?: string; notes?: string;
};
export type WorkerAccount = {
  username: string; password: string; name: string; trade: string;
  /** up to 5 selected professions */
  trades?: string[];
  country: string; blocked: boolean; earnings: number; verified?: boolean;
};
export type Complaint = { id: string; from: string; against: string; subject: string; message: string; createdAt: number; status: "open" | "resolved" };
export type UrgentBid = { id: string; customer: string; trade: string; title: string; description: string; budget: number; location: string; createdAt: number; status: "open" | "accepted"; acceptedBy?: string };
export type Suggestion = { id: string; from: string; kind: "suggestion" | "feedback"; message: string; createdAt: number };
export type Session = { role: Role; username: string } | null;

export const TRADES = [
  "Electrician", "Carpenter", "Plumber", "Painter", "Mechanic", "AC Technician",
  "Welder", "Mason", "Cleaner", "Driver", "Gardener", "Beautician", "Cook",
  "Tailor", "IT Support", "Mover", "Tutor", "Nurse",
  "Math Teacher", "English Teacher", "General Physician", "Pediatrician",
];

const K = {
  customers: "ustaadly:customers",
  workers: "ustaadly:workers",
  complaints: "ustaadly:complaints",
  session: "ustaadly:session",
  jobs: "ustaadly:jobs",
  urgent: "ustaadly:urgent",
  suggestions: "ustaadly:suggestions",
};

const ADMIN = { username: "admin", password: "admin" };
const WORKER_DEMO: WorkerAccount = { username: "worker", password: "worker", name: "Demo Worker", trade: "Electrician", trades: ["Electrician"], country: "Pakistan", blocked: false, earnings: 24500, verified: true };
const CUSTOMER_DEMO: Customer = {
  username: "Customer", password: "customer",
  name: "Demo Customer", email: "customer@example.com", phone: "+92 300 0000000",
  cnic: "00000-0000000-0", country: "Pakistan",
  address: "House 12, Street 4, Lahore", dob: "1995-06-12",
  emergencyContact: "+92 300 1111111", notes: "Prefers morning appointments.",
};

const SEED_WORKERS: WorkerAccount[] = [
  WORKER_DEMO,
  { username: "ahmad", password: "ahmad123", name: "Ahmad Ali", trade: "Electrician", country: "Pakistan", blocked: false, earnings: 18200, verified: true },
  { username: "nauman", password: "nauman123", name: "M. Nauman", trade: "Electrician", country: "Pakistan", blocked: false, earnings: 32500, verified: true },
  { username: "imran", password: "imran123", name: "Imran Khan", trade: "Carpenter", country: "Pakistan", blocked: false, earnings: 15400, verified: true },
  { username: "yousaf", password: "yousaf123", name: "Yousaf Malik", trade: "Carpenter", country: "Pakistan", blocked: false, earnings: 9800, verified: false },
  { username: "bilal", password: "bilal123", name: "Bilal Hussain", trade: "Plumber", country: "Pakistan", blocked: false, earnings: 21300, verified: true },
  { username: "asif", password: "asif123", name: "Asif Raza", trade: "Plumber", country: "Pakistan", blocked: false, earnings: 11200, verified: false },
  { username: "sara", password: "sara123", name: "Sara Iqbal", trade: "Math Teacher", country: "Pakistan", blocked: false, earnings: 27000, verified: true },
  { username: "hamza", password: "hamza123", name: "Hamza Sheikh", trade: "English Teacher", country: "Pakistan", blocked: false, earnings: 19500, verified: true },
  { username: "ayesha", password: "ayesha123", name: "Dr. Ayesha Khan", trade: "General Physician", country: "Pakistan", blocked: false, earnings: 48000, verified: true },
  { username: "usman", password: "usman123", name: "Dr. Usman Tariq", trade: "Pediatrician", country: "Pakistan", blocked: false, earnings: 52500, verified: true },
  { username: "zahid", password: "zahid123", name: "Zahid Painter", trade: "Painter", country: "Pakistan", blocked: false, earnings: 7600, verified: false },
  { username: "tariq", password: "tariq123", name: "Tariq Mechanic", trade: "Mechanic", country: "Pakistan", blocked: true, earnings: 4300, verified: false },
];

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("ustaadly:storage"));
}

function ensureSeed() {
  if (typeof window === "undefined") return;
  const ws = read<WorkerAccount[]>(K.workers, []);
  const map = new Map(ws.map((w) => [w.username, w]));
  let changed = false;
  for (const seed of SEED_WORKERS) {
    if (!map.has(seed.username)) { map.set(seed.username, seed); changed = true; }
  }
  if (changed) write(K.workers, Array.from(map.values()));

  const cs = read<Customer[]>(K.customers, []);
  if (!cs.find((c) => c.username === CUSTOMER_DEMO.username)) {
    write(K.customers, [...cs, CUSTOMER_DEMO]);
  }
}

type Ctx = {
  session: Session;
  customers: Customer[];
  workers: WorkerAccount[];
  complaints: Complaint[];
  signupCustomer: (c: Customer) => { ok: boolean; error?: string };
  login: (username: string, password: string) => { ok: boolean; role?: Role; error?: string };
  logout: () => void;
  fileComplaint: (c: Omit<Complaint, "id" | "createdAt" | "status">) => void;
  resolveComplaint: (id: string) => void;
  blockWorker: (username: string, blocked: boolean) => void;
  removeWorker: (username: string) => void;
  verifyWorker: (username: string, verified: boolean) => void;
  resetWorkerPassword: (username: string, newPassword: string) => void;
  adjustEarnings: (username: string, amount: number) => void;
  removeCustomer: (username: string) => void;
  urgentBids: UrgentBid[];
  postUrgentBid: (b: Omit<UrgentBid, "id" | "createdAt" | "status" | "acceptedBy">) => void;
  acceptUrgentBid: (id: string, workerUsername: string) => void;
  updateWorkerProfile: (username: string, patch: Partial<Pick<WorkerAccount, "name" | "trade" | "trades" | "country">>) => void;
  updateCustomerProfile: (username: string, patch: Partial<Omit<Customer, "username" | "password">> & { password?: string }) => void;
  suggestions: Suggestion[];
  addSuggestion: (s: Omit<Suggestion, "id" | "createdAt">) => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workers, setWorkers] = useState<WorkerAccount[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [urgentBids, setUrgentBids] = useState<UrgentBid[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const refresh = useCallback(() => {
    setSession(read<Session>(K.session, null));
    setCustomers(read<Customer[]>(K.customers, []));
    setWorkers(read<WorkerAccount[]>(K.workers, []));
    setComplaints(read<Complaint[]>(K.complaints, []));
    setUrgentBids(read<UrgentBid[]>(K.urgent, []));
    setSuggestions(read<Suggestion[]>(K.suggestions, []));
  }, []);

  useEffect(() => {
    ensureSeed();
    refresh();
    const h = () => refresh();
    window.addEventListener("ustaadly:storage", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("ustaadly:storage", h); window.removeEventListener("storage", h); };
  }, [refresh]);

  const value = useMemo<Ctx>(() => ({
    session, customers, workers, complaints,
    signupCustomer: (c) => {
      const list = read<Customer[]>(K.customers, []);
      if (list.find((x) => x.username === c.username)) return { ok: false, error: "Username already taken" };
      write(K.customers, [...list, c]);
      write<Session>(K.session, { role: "customer", username: c.username });
      refresh();
      return { ok: true };
    },
    login: (u, p) => {
      if (u === ADMIN.username && p === ADMIN.password) {
        write<Session>(K.session, { role: "admin", username: u }); refresh();
        return { ok: true, role: "admin" };
      }
      const ws = read<WorkerAccount[]>(K.workers, []);
      const w = ws.find((x) => x.username === u && x.password === p);
      if (w) {
        if (w.blocked) return { ok: false, error: "This worker account is blocked." };
        write<Session>(K.session, { role: "worker", username: u }); refresh();
        return { ok: true, role: "worker" };
      }
      const cs = read<Customer[]>(K.customers, []);
      const c = cs.find((x) => x.username === u && x.password === p);
      if (c) {
        write<Session>(K.session, { role: "customer", username: u }); refresh();
        return { ok: true, role: "customer" };
      }
      return { ok: false, error: "Invalid credentials" };
    },
    logout: () => { localStorage.removeItem(K.session); refresh(); },
    fileComplaint: (c) => {
      const list = read<Complaint[]>(K.complaints, []);
      write(K.complaints, [...list, { ...c, id: crypto.randomUUID(), createdAt: Date.now(), status: "open" }]);
      refresh();
    },
    resolveComplaint: (id) => {
      const list = read<Complaint[]>(K.complaints, []);
      write(K.complaints, list.map((x) => (x.id === id ? { ...x, status: "resolved" } : x)));
      refresh();
    },
    blockWorker: (u, blocked) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.map((w) => (w.username === u ? { ...w, blocked } : w)));
      refresh();
    },
    removeWorker: (u) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.filter((w) => w.username !== u));
      refresh();
    },
    verifyWorker: (u, verified) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.map((w) => (w.username === u ? { ...w, verified } : w)));
      refresh();
    },
    resetWorkerPassword: (u, newPassword) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.map((w) => (w.username === u ? { ...w, password: newPassword } : w)));
      refresh();
    },
    adjustEarnings: (u, amount) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.map((w) => (w.username === u ? { ...w, earnings: Math.max(0, w.earnings + amount) } : w)));
      refresh();
    },
    removeCustomer: (u) => {
      const list = read<Customer[]>(K.customers, []);
      write(K.customers, list.filter((c) => c.username !== u));
      refresh();
    },
    urgentBids,
    postUrgentBid: (b) => {
      const list = read<UrgentBid[]>(K.urgent, []);
      write(K.urgent, [{ ...b, id: crypto.randomUUID(), createdAt: Date.now(), status: "open" }, ...list]);
      refresh();
    },
    acceptUrgentBid: (id, workerUsername) => {
      const list = read<UrgentBid[]>(K.urgent, []);
      write(K.urgent, list.map((x) => (x.id === id && x.status === "open" ? { ...x, status: "accepted", acceptedBy: workerUsername } : x)));
      refresh();
    },
    updateWorkerProfile: (u, patch) => {
      const list = read<WorkerAccount[]>(K.workers, []);
      write(K.workers, list.map((w) => (w.username === u ? { ...w, ...patch } : w)));
      refresh();
    },
  }), [session, customers, workers, complaints, urgentBids, refresh]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export const COUNTRIES = [
  "Pakistan", "India", "United States", "United Kingdom", "Canada", "Australia",
  "United Arab Emirates", "Saudi Arabia", "Germany", "France", "Turkey", "Bangladesh", "Other",
];
