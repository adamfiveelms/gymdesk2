import postgres from "postgres";

/**
 * Uses postgres.js which works well in serverless.
 * Expects DATABASE_URL in environment variables.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL env var");
  }
  // Avoid creating many pools in serverless by reusing global
  if (!globalThis.__adamdesk_sql) {
    globalThis.__adamdesk_sql = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10
    });
  }
  return globalThis.__adamdesk_sql;
}

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

export function handleOptions(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }
  return null;
}
