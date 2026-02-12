import { api } from "../lib/api";

export default async function Home() {
  let data: any = null;
  let error: string | null = null;

  try {
    data = await api.health();
  } catch (e: any) {
    error = e?.message || String(e);
  }

  return (
    <main>
      <h1 style={{ fontSize: 28, margin: 0 }}>AdamDesk</h1>
      <p style={{ marginTop: 8 }}>
        This is a deployable starter (Web + API + DB).
      </p>

      <h2 style={{ marginTop: 24 }}>API health</h2>
      {error ? (
        <pre style={{ background: "#fee2e2", padding: 12 }}>{error}</pre>
      ) : (
        <pre style={{ background: "#f4f4f5", padding: 12 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      <h2 style={{ marginTop: 24 }}>Next step</h2>
      <ol>
        <li>Create a Neon Postgres DB and set <code>DATABASE_URL</code> in Netlify.</li>
        <li>Hit <code>/.netlify/functions/migrate</code> once to create tables.</li>
        <li>Use the Members/Sessions/Bookings pages.</li>
      </ol>
    </main>
  );
}
