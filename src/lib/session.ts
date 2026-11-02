"use client";

/**
 * Client-side mock session + org store.
 *
 * There is no backend yet: auth, organizations and employees live in
 * localStorage so the whole flow (login → create org → dashboard) runs end to
 * end. Swap these functions for real API / NEAR wallet calls later — the UI
 * only talks to the exported hooks and actions.
 */

import { useSyncExternalStore } from "react";

export type Role = "admin" | "employee";
export type AuthMethod = "near" | "google" | "email";

export interface User {
  name: string;
  email: string;
  role: Role;
  method: AuthMethod;
  wallet?: string;
}

export type EmployeeStatus = "active" | "invited" | "paused";

export interface Employee {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  salary: number; // monthly, USD
  token: string;
  chain: string;
  status: EmployeeStatus;
  startDate: string;
}

export interface PayRun {
  id: string;
  period: string;
  date: string;
  total: number;
  people: number;
  status: "settled" | "scheduled";
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  country: string;
  size: string;
  token: string;
  chain: string;
  cycle: "monthly" | "biweekly";
  shielded: boolean;
  createdAt: string;
  employees: Employee[];
  runs: PayRun[];
}

interface State {
  user: User | null;
  orgs: Org[];
  currentOrgId: string | null;
}

const KEY = "fido:session:v1";
const EMPTY: State = { user: null, orgs: [], currentOrgId: null };

let cache: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: State) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** `null` during SSR / first paint, then the stored state. */
export function useSession(): State | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function useCurrentOrg(): Org | null {
  const s = useSession();
  if (!s) return null;
  return s.orgs.find((o) => o.id === s.currentOrgId) ?? s.orgs[0] ?? null;
}

/* --------------------------------------------------------------- actions */

export const uid = () => Math.random().toString(36).slice(2, 10);

export function signIn(user: User) {
  write({ ...read(), user });
}

export function signOut() {
  write({ ...read(), user: null });
}

export function createOrg(input: Omit<Org, "id" | "createdAt" | "runs">): Org {
  const org: Org = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
    runs: seedRuns(input.employees),
  };
  const s = read();
  write({ ...s, orgs: [...s.orgs, org], currentOrgId: org.id });
  return org;
}

export function switchOrg(id: string) {
  write({ ...read(), currentOrgId: id });
}

export function updateOrg(id: string, patch: Partial<Org>) {
  const s = read();
  write({ ...s, orgs: s.orgs.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
}

export function addEmployee(orgId: string, e: Omit<Employee, "id">) {
  const s = read();
  write({
    ...s,
    orgs: s.orgs.map((o) => (o.id === orgId ? { ...o, employees: [{ ...e, id: uid() }, ...o.employees] } : o)),
  });
}

export function recordRun(orgId: string, run: Omit<PayRun, "id">) {
  const s = read();
  write({
    ...s,
    orgs: s.orgs.map((o) => (o.id === orgId ? { ...o, runs: [{ ...run, id: uid() }, ...o.runs] } : o)),
  });
}

/* --------------------------------------------------------------- helpers */

/** What the next pay run will pay: active people only (invited aren't on payroll yet). */
export const monthlyTotal = (org: Org) =>
  org.employees.filter((e) => e.status === "active").reduce((sum, e) => sum + e.salary, 0);

export const usd = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits });

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "?";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

function seedRuns(employees: Employee[]): PayRun[] {
  if (employees.length === 0) return [];
  const total = employees.reduce((s, e) => s + e.salary, 0);
  const now = new Date();
  return [3, 2, 1].map((back, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - back, 28);
    return {
      id: uid(),
      period: d.toLocaleString("en-US", { month: "long", year: "numeric" }),
      date: d.toISOString(),
      total: Math.round(total * (0.9 + i * 0.05)),
      people: Math.max(1, employees.length - (2 - i)),
      status: "settled" as const,
    };
  }).reverse();
}

export const SAMPLE_TEAM: Omit<Employee, "id">[] = [
  { name: "Amara Okafor", email: "amara@acme.xyz", title: "Staff Engineer", department: "Engineering", salary: 8400, token: "USDC", chain: "NEAR", status: "active", startDate: "2024-03-04" },
  { name: "Lucas Moreau", email: "lucas@acme.xyz", title: "Product Designer", department: "Design", salary: 6250, token: "USDT", chain: "Arbitrum", status: "active", startDate: "2024-06-17" },
  { name: "Priya Raman", email: "priya@acme.xyz", title: "Head of Ops", department: "Operations", salary: 5900, token: "NEAR", chain: "NEAR", status: "active", startDate: "2023-11-01" },
  { name: "Mei Tanaka", email: "mei@acme.xyz", title: "Finance Lead", department: "Finance", salary: 6800, token: "USDC", chain: "Solana", status: "active", startDate: "2025-01-13" },
  { name: "Diego Alvarez", email: "diego@acme.xyz", title: "Growth Manager", department: "Growth", salary: 7100, token: "ETH", chain: "Base", status: "active", startDate: "2024-09-02" },
  { name: "Noah Fischer", email: "noah@acme.xyz", title: "Support Engineer", department: "Support", salary: 4600, token: "USDC", chain: "NEAR", status: "invited", startDate: "2026-11-10" },
];

export const TOKENS = ["USDC", "USDT", "NEAR", "ETH", "BTC"] as const;
export const CHAINS = ["NEAR", "Ethereum", "Arbitrum", "Base", "Solana", "Bitcoin"] as const;
export const COUNTRIES = ["United States", "United Kingdom", "Germany", "India", "Singapore", "United Arab Emirates", "Canada", "Other"] as const;
