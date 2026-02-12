import { getSql, json, handleOptions } from "./_db.js";

export async function handler(event) {
  const opt = handleOptions(event);
  if (opt) return opt;

  try {
    const sql = getSql();
    const r = await sql`select now() as now`;
    return json(200, { ok: true, name: "AdamDesk", dbTime: r[0].now });
  } catch (e) {
    return json(500, { ok: false, error: String(e?.message || e) });
  }
}
