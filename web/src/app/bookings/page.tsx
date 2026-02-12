import { api } from "../../lib/api";

export default async function BookingsPage() {
  const bookings = await api.bookings.list();

  return (
    <main>
      <h1 style={{ fontSize: 22, margin: 0 }}>Bookings</h1>
      <pre style={{ background: "#f4f4f5", padding: 12, overflow: "auto" }}>
        {JSON.stringify(bookings, null, 2)}
      </pre>
    </main>
  );
}
