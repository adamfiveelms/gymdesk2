import "./globals.css";

export const metadata = {
  title: "Gymdesk Lite",
  description: "Gym management web app for owners"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a href="/" style={{ fontWeight: 800, textDecoration: "none" }}>Gymdesk Lite</a>
          <nav className="nav">
            <a href="/">Dashboard</a>
            <a href="/members">Members</a>
            <a href="/sessions">Classes</a>
            <a href="/bookings">Bookings</a>
          </nav>
        </header>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
