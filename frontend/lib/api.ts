const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const debug = typeof window !== "undefined" ? localStorage.getItem("debugDate") : null;  // simulated day
  const res = await fetch(BASE + path, { ...init, cache: "no-store",
    headers: { "Content-Type": "application/json", ...(debug ? { "X-Debug-Date": debug } : {}) } });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
  return res.json();
}
export const post = <T,>(p: string, body?: unknown) => api<T>(p, { method: "POST", body: JSON.stringify(body ?? {}) });
