"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });

  async function load() {
    try {
      setError("");
      setMembers(await api.members.list());
    } catch (e) {
      setError(e.message || "Failed loading members");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.members.create(form);
      setForm({ full_name: "", email: "", phone: "" });
      await load();
    } catch (e) {
      setError(e.message || "Failed creating member");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(member) {
    try {
      await api.members.update(member.id, { status: member.status === "active" ? "inactive" : "active" });
      await load();
    } catch (e) {
      setError(e.message || "Failed updating member");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this member?")) return;
    try {
      await api.members.remove(id);
      await load();
    } catch (e) {
      setError(e.message || "Failed deleting member");
    }
  }

  return (
    <main className="grid">
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Members</h1>
        <p className="muted">Create, activate/deactivate, and remove members.</p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Add member</h2>
        <form onSubmit={onCreate}>
          <div className="form-row">
            <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button disabled={saving}>{saving ? "Saving..." : "Create member"}</button>
        </form>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.full_name}</td>
                <td>{member.email || "—"}</td>
                <td>{member.phone || "—"}</td>
                <td>{member.status}</td>
                <td style={{ display: "flex", gap: ".4rem" }}>
                  <button className="secondary" onClick={() => onToggleStatus(member)}>Toggle status</button>
                  <button className="danger" onClick={() => onDelete(member.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
