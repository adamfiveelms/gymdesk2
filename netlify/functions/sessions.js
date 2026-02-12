import { getSql, json, handleOptions } from "./_db.js";
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
        const rows = await sql`select * from sessions where id=${id} limit 1`;
        return json(200, rows[0] || null);
      }
      const rows = await sql`select * from sessions order by starts_at asc limit 200`;
      return json(200, rows);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.title) return json(400, { error: "title is required" });
      if (!body.starts_at || !body.ends_at) return json(400, { error: "starts_at and ends_at are required (ISO strings)" });

      const rows = await sql`
        insert into sessions (title, starts_at, ends_at, capacity)
        values (${body.title}, ${body.starts_at}, ${body.ends_at}, ${body.capacity ?? 0})
        returning *;
      `;
      return json(201, rows[0]);
    }

    if (event.httpMethod === "PUT") {
      if (!id) return json(400, { error: "id is required" });
      const body = JSON.parse(event.body || "{}");
      const rows = await sql`
        update sessions
        set
          title = coalesce(${body.title}, title),
          starts_at = coalesce(${body.starts_at}, starts_at),
          ends_at = coalesce(${body.ends_at}, ends_at),
          capacity = coalesce(${body.capacity}, capacity)
        where id=${id}
        returning *;
      `;
      return json(200, rows[0] || null);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return json(400, { error: "id is required" });
      await sql`delete from sessions where id=${id}`;
      return json(200, { ok: true });
    }

    return json(405, { error: "Method not allowed" });
  } catch (e) {
    return json(500, { error: String(e?.message || e) });
  }
}
