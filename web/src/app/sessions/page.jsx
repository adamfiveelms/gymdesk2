"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const defaultTime = () => {
  const dt = new Date(Date.now() + 60 * 60 * 1000);
  dt.setMinutes(0, 0, 0);
  return dt.toISOString().slice(0, 16);
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    starts_at: defaultTime(),
    ends_at: defaultTime(),
    capacity: 20
  });

  async function load() {
    try {
      setError("");
      setSessions(await api.sessions.list());
    } catch (e) {
      setError(e.message || "Failed loading classes");
    }
  }

  useEffect(() => {
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, ends_at: end }));
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    try {
      await api.sessions.create({ ...form, starts_at: new Date(form.starts_at).toISOString(), ends_at: new Date(form.ends_at).toISOString() });
      setForm({ ...form, title: "" });
      await load();
    } catch (e) {
      setError(e.message || "Failed creating class");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this class?")) return;
    try {
      await api.sessions.remove(id);
      await load();
    } catch (e) {
      setError(e.message || "Failed deleting class");
    }
  }

  return (
    <main className="grid">
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Classes</h1>
        <p className="muted">Create and manage your gym schedule.</p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Create class</h2>
        <form onSubmit={onCreate}>
          <div className="form-row">
            <input required placeholder="Class title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input required type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
            <input required type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
            <input required type="number" min={0} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          </div>
          <button>Create class</button>
        </form>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <table>
          <thead>
            <tr><th>Title</th><th>Start</th><th>End</th><th>Capacity</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.title}</td>
                <td>{new Date(session.starts_at).toLocaleString()}</td>
                <td>{new Date(session.ends_at).toLocaleString()}</td>
                <td>{session.capacity}</td>
                <td><button className="danger" onClick={() => onDelete(session.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
