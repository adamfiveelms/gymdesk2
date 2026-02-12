export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "/.netlify/functions";

async function req(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export const api = {
  health: () => req("/healthz"),

  members: {
    list: () => req("/members"),
    create: (m: { full_name: string; email?: string; phone?: string }) =>
      req("/members", { method: "POST", body: JSON.stringify(m) }),
    remove: (id: string) => req(`/members?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  },

  sessions: {
    list: () => req("/sessions"),
    create: (s: { title: string; starts_at: string; ends_at: string; capacity?: number }) =>
      req("/sessions", { method: "POST", body: JSON.stringify(s) })
  },

  bookings: {
    list: () => req("/bookings"),
    create: (b: { member_id: string; session_id: string }) =>
      req("/bookings", { method: "POST", body: JSON.stringify(b) })
  }
};
