import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "customer" | "worker" | "admin";

export type Customer = { username: string; password: string; name: string; email: string; phone: string; cnic: string; country: string };
export type WorkerAccount = { username: string; password: string; name: string; trade: string; country: string; blocked: boolean; earnings: number };
export type Complaint = { id: string; from: string; against: string; subject: string; message: string; createdAt: number; status: "open" | "resolved" };
export type Session = { role: Role; username: string } | null;

const K = {
  customers: "ustaadly:customers",
  workers: "ustaadly:workers",
  complaints: "ustaadly:complaints",
  session: "ustaadly:session",
  jobs: "ustaadly:jobs",
};

const ADMIN = { username: "admin", password: "admin" };
const WORKER_DEMO: WorkerAccount = { username: "worker", password: "worker", name: "Demo Worker", trade: "Electrician", country: "Pakistan", blocked: false, earnings: 24500 };

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
  if (!ws.find((w) => w.username === "worker")) {
    write(K.workers, [WORKER_DEMO, ...ws]);
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
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workers, setWorkers] = useState<WorkerAccount[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const refresh = useCallback(() => {
    setSession(read<Session>(K.session, null));
    setCustomers(read<Customer[]>(K.customers, []));
    setWorkers(read<WorkerAccount[]>(K.workers, []));
    setComplaints(read<Complaint[]>(K.complaints, []));
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
  }), [session, customers, workers, complaints, refresh]);

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
