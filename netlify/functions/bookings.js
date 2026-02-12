import { getSql, json, handleOptions } from "./db.js";
import { requireAdmin } from "./_auth.js";

export async function handler(event) {
  const opt = handleOptions(event);
  if (opt) return opt;

  const authFail = requireAdmin(event);
  if (authFail) return authFail;

  const sql = getSql();
  const id = event.queryStringParameters?.id;

  try {
    if (event.httpMethod === "GET") {
      if (id) {
        const rows = await sql`
          select b.*, m.full_name, s.title, s.starts_at
          from bookings b
          join members m on m.id=b.member_id
          join sessions s on s.id=b.session_id
          where b.id=${id}
          limit 1
        `;
        return json(200, rows[0] || null);
      }

      const rows = await sql`
        select b.*, m.full_name, s.title, s.starts_at
        from bookings b
        join members m on m.id=b.member_id
        join sessions s on s.id=b.session_id
        order by b.created_at desc
        limit 200
      `;
      return json(200, rows);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.member_id || !body.session_id) return json(400, { error: "member_id and session_id required" });

      // Basic capacity check (optional, simplistic)
      const cap = await sql`select capacity from sessions where id=${body.session_id} limit 1`;
      if (!cap[0]) return json(404, { error: "Session not found" });

      if (cap[0].capacity > 0) {
        const count = await sql`select count(*)::int as n from bookings where session_id=${body.session_id} and status='booked'`;
        if (count[0].n >= cap[0].capacity) return json(409, { error: "Session full" });
      }

      const rows = await sql`
        insert into bookings (member_id, session_id, status)
        values (${body.member_id}, ${body.session_id}, 'booked')
        on conflict (member_id, session_id) do update set status='booked'
        returning *;
      `;
      return json(201, rows[0]);
    }

    if (event.httpMethod === "PUT") {
      if (!id) return json(400, { error: "id is required" });
      const body = JSON.parse(event.body || "{}");
      const rows = await sql`
        update bookings
        set status = coalesce(${body.status}, status)
        where id=${id}
        returning *;
      `;
      return json(200, rows[0] || null);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return json(400, { error: "id is required" });
      await sql`delete from bookings where id=${id}`;
      return json(200, { ok: true });
    }

    return json(405, { error: "Method not allowed" });
  } catch (e) {
    return json(500, { error: String(e?.message || e) });
  }
}
