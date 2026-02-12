import { api } from "../../lib/api";

export default async function MembersPage() {
  const members = await api.members.list();

  return (
    <main>
      <h1 style={{ fontSize: 22, margin: 0 }}>Members</h1>
      <p style={{ marginTop: 8 }}>Create via API for now; UI form can be added next.</p>

      <pre style={{ background: "#f4f4f5", padding: 12, overflow: "auto" }}>
        {JSON.stringify(members, null, 2)}
      </pre>

      <p>
        Tip: POST a member using curl:
      </p>
      <pre style={{ background: "#111827", color: "white", padding: 12, overflow: "auto" }}>
{`curl -X POST "$NEXT_PUBLIC_SITE_URL/.netlify/functions/members" \\
  -H "content-type: application/json" \\
  -d '{"full_name":"Ada Lovelace","email":"ada@example.com"}'`}
      </pre>
    </main>
  );
}
