function normalizeSiteUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

function getApiBase() {
  const configured = process.env.NEXT_PUBLIC_API_BASE || "/.netlify/functions";

  if (configured.startsWith("http://") || configured.startsWith("https://")) {
    return configured;
  }

  if (typeof window !== "undefined") {
    return configured;
  }

  const serverBase =
    normalizeSiteUrl(process.env.URL) ||
    normalizeSiteUrl(process.env.DEPLOY_PRIME_URL) ||
    normalizeSiteUrl(process.env.DEPLOY_URL) ||
    "http://127.0.0.1:8888";

  return new URL(configured, serverBase).toString().replace(/\/$/, "");
}

async function req(path, init) {
  const base = getApiBase();
  const res = await fetch(`${base}${path}`, {
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
    create: (m) => req("/members", { method: "POST", body: JSON.stringify(m) }),
    update: (id, m) => req(`/members?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(m) }),
    remove: (id) => req(`/members?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  },

  sessions: {
    list: () => req("/sessions"),
    create: (s) => req("/sessions", { method: "POST", body: JSON.stringify(s) }),
    update: (id, s) => req(`/sessions?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(s) }),
    remove: (id) => req(`/sessions?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  },

  bookings: {
    list: () => req("/bookings"),
    create: (b) => req("/bookings", { method: "POST", body: JSON.stringify(b) }),
    update: (id, b) => req(`/bookings?id=${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(b) }),
    remove: (id) => req(`/bookings?id=${encodeURIComponent(id)}`, { method: "DELETE" })
  }
};
