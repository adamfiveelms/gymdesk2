export const metadata = {
  title: "AdamDesk",
  description: "AdamDesk starter"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
            AdamDesk
          </a>
          <span style={{ marginLeft: 16 }}>
            <a href="/members">Members</a>{" "}
            <a href="/sessions" style={{ marginLeft: 12 }}>Sessions</a>{" "}
            <a href="/bookings" style={{ marginLeft: 12 }}>Bookings</a>
          </span>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
