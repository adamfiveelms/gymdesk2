"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function BookingsPage() {
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ member_id: "", session_id: "" });

  async function load() {
    try {
      setError("");
      const [m, s, b] = await Promise.all([api.members.list(), api.sessions.list(), api.bookings.list()]);
      setMembers(m);
      setSessions(s);
      setBookings(b);
      setForm((prev) => ({
        member_id: prev.member_id || m[0]?.id || "",
        session_id: prev.session_id || s[0]?.id || ""
      }));
    } catch (e) {
      setError(e.message || "Failed loading bookings data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    try {
      await api.bookings.create(form);
      await load();
    } catch (e) {
      setError(e.message || "Failed creating booking");
    }
  }

  async function onStatus(id, status) {
    try {
      await api.bookings.update(id, { status });
      await load();
    } catch (e) {
      setError(e.message || "Failed updating booking");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.bookings.remove(id);
      await load();
    } catch (e) {
      setError(e.message || "Failed deleting booking");
    }
  }

  return (
    <main className="grid">
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Bookings</h1>
        <p className="muted">Enroll members into classes and manage attendance state.</p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Create booking</h2>
        <form onSubmit={onCreate}>
          <div className="form-row">
            <select required value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name}</option>
              ))}
            </select>
            <select required value={form.session_id} onChange={(e) => setForm({ ...form, session_id: e.target.value })}>
              <option value="">Select class</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({new Date(s.starts_at).toLocaleString()})</option>
              ))}
            </select>
          </div>
          <button disabled={!form.member_id || !form.session_id}>Create booking</button>
        </form>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <table>
          <thead>
            <tr><th>Member</th><th>Class</th><th>When</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.full_name}</td>
                <td>{booking.title}</td>
                <td>{new Date(booking.starts_at).toLocaleString()}</td>
                <td>{booking.status}</td>
                <td style={{ display: "flex", gap: ".4rem" }}>
                  <button className="secondary" onClick={() => onStatus(booking.id, booking.status === "booked" ? "cancelled" : "booked")}>Toggle status</button>
                  <button className="danger" onClick={() => onDelete(booking.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
