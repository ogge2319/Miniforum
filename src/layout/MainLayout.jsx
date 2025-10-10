// MainLayout.jsx – Grundlayout för alla sidor (Header + Content + CookieBanner)
import { Link, Outlet } from "react-router-dom";
import "../styles/global.css"; // om du har global styling

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      {/* Enkel header/navigation */}
      <header className="surface card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">🏠 Hem</Link>
          <Link to="/login">Logga in</Link>
          <Link to="/register">Registrera</Link>
          <Link to="/settings">Inställningar</Link>
          <Link to="/privacy">Integritetspolicy</Link>
        </nav>
      </header>

      {/* Här visas alla sidor */}
      <main style={{ padding: "1rem" }}>
        {children || <Outlet />}
      </main>

      {/* Enkel footer */}
      <footer style={{ textAlign: "center", padding: "1rem", marginTop: "2rem", borderTop: "1px solid #ccc" }}>
        <small>© 2025 MiniForum – Demo</small>
      </footer>
    </div>
  );
}
