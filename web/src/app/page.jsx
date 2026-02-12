import { api } from "../lib/api";

export default async function Home() {
  const [health, members, sessions, bookings] = await Promise.all([
    api.health(),
    api.members.list(),
    api.sessions.list(),
    api.bookings.list()
  ]);

  const upcoming = sessions
    .filter((s) => new Date(s.starts_at).getTime() >= Date.now())
    .slice(0, 5);

  return (
    <main className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Owner Dashboard</h1>
        <p className="muted">Run memberships, classes, and bookings from one place.</p>
        <p className="muted">API: {health.ok ? "Connected" : "Unavailable"}</p>
      </section>

      <section className="grid grid-3">
        <div className="card"><strong>{members.length}</strong><div className="muted">Total members</div></div>
        <div className="card"><strong>{sessions.length}</strong><div className="muted">Total classes</div></div>
        <div className="card"><strong>{bookings.length}</strong><div className="muted">Total bookings</div></div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Upcoming classes</h2>
        {upcoming.length === 0 ? (
          <p className="muted">No upcoming classes yet. Create one in the Classes page.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Class</th><th>Starts</th><th>Ends</th><th>Capacity</th></tr>
            </thead>
            <tbody>
              {upcoming.map((session) => (
                <tr key={session.id}>
                  <td>{session.title}</td>
                  <td>{new Date(session.starts_at).toLocaleString()}</td>
                  <td>{new Date(session.ends_at).toLocaleString()}</td>
                  <td>{session.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
