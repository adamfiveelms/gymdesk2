import { json } from "./db.js";

/**
 * Optional admin protection.
 * If ADMIN_API_KEY is unset, auth is disabled for easy local development.
 */
export function requireAdmin(event) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return null;

  const header =
    event.headers?.authorization ||
    event.headers?.Authorization ||
    "";

  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (token !== expected) {
    return json(401, { error: "Unauthorized" });
  }

  return null;
}
