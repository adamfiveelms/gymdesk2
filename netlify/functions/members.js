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
        const rows = await sql`select * from members where id=${id} limit 1`;
        return json(200, rows[0] || null);
      }
      const rows = await sql`select * from members order by created_at desc limit 200`;
      return json(200, rows);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.full_name) return json(400, { error: "full_name is required" });

      const rows = await sql`
        insert into members (full_name, email, phone, status)
        values (${body.full_name}, ${body.email || null}, ${body.phone || null}, ${body.status || "active"})
        returning *;
      `;
      return json(201, rows[0]);
    }

    if (event.httpMethod === "PUT") {
      if (!id) return json(400, { error: "id is required" });
      const body = JSON.parse(event.body || "{}");
      const rows = await sql`
        update members
        set
          full_name = coalesce(${body.full_name}, full_name),
          email = coalesce(${body.email}, email),
          phone = coalesce(${body.phone}, phone),
          status = coalesce(${body.status}, status)
        where id=${id}
        returning *;
      `;
      return json(200, rows[0] || null);
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return json(400, { error: "id is required" });
      await sql`delete from members where id=${id}`;
      return json(200, { ok: true });
    }

    return json(405, { error: "Method not allowed" });
  } catch (e) {
    return json(500, { error: String(e?.message || e) });
  }
}
