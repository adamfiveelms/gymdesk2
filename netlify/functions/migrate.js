import { getSql, json, handleOptions } from "./db.js";
import { requireAdmin } from "./_auth.js";

/**
 * Creates basic tables:
 * - members
 * - sessions
 * - bookings
 *
 * Safe to run multiple times.
 */
export async function handler(event) {
  const opt = handleOptions(event);
  if (opt) return opt;

  const authFail = requireAdmin(event);
  if (authFail) return authFail;

  try {
    const sql = getSql();

    await sql`
      create table if not exists members (
        id uuid primary key default gen_random_uuid(),
        full_name text not null,
        email text,
        phone text,
        status text not null default 'active',
        created_at timestamptz not null default now()
      );
    `;

    await sql`
      create table if not exists sessions (
        id uuid primary key default gen_random_uuid(),
        title text not null,
        starts_at timestamptz not null,
        ends_at timestamptz not null,
        capacity int not null default 0,
        created_at timestamptz not null default now()
      );
    `;

    await sql`
      create table if not exists bookings (
        id uuid primary key default gen_random_uuid(),
        member_id uuid not null references members(id) on delete cascade,
        session_id uuid not null references sessions(id) on delete cascade,
        status text not null default 'booked',
        created_at timestamptz not null default now(),
        unique(member_id, session_id)
      );
    `;

    return json(200, { ok: true, message: "Migration complete" });
  } catch (e) {
    return json(500, { ok: false, error: String(e?.message || e) });
  }
}
