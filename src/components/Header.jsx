import { Link } from "react-router-dom";
import { Sun, Moon, Home, User, Settings, UserPlus } from "lucide-react"; // 🆕 lade till UserPlus
import { useState, useEffect } from "react";
import styles from "./header.module.css";

export default function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          🐦 MiniForum
        </Link>

        <div className={styles.links}>
          <Link to="/" className={styles.iconLink} title="Hem">
            <Home size={22} />
          </Link>
          <Link to="/settings" className={styles.iconLink} title="Inställningar">
            <Settings size={22} />
          </Link>
          <Link to="/login" className={styles.iconLink} title="Logga in">
            <User size={22} />
          </Link>
          {/* 🆕 Ny ikon för registrering */}
          <Link to="/register" className={styles.iconLink} title="Registrera konto">
            <UserPlus size={22} />
          </Link>
        </div>

        <button
          className={styles.themeToggle}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Växla tema"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </header>
  );
}
