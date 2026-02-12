import { api } from "../../lib/api";

export default async function SessionsPage() {
  const sessions = await api.sessions.list();

  return (
    <main>
      <h1 style={{ fontSize: 22, margin: 0 }}>Sessions</h1>
      <pre style={{ background: "#f4f4f5", padding: 12, overflow: "auto" }}>
        {JSON.stringify(sessions, null, 2)}
      </pre>
    </main>
  );
}
