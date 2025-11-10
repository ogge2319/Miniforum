import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, Home, User, Settings, UserPlus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./header.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  console.log('Header user:', user);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

          {user ? (
            <>
              {user._id && (
                <Link to={`/profile/${user._id}`} className={styles.iconLink} title="Min profil">
                  <User size={22} />
                </Link>
              )}
              <Link to="/settings" className={styles.iconLink} title="Inställningar">
                <Settings size={22} />
              </Link>
              <button
                onClick={handleLogout}
                className={styles.iconLink}
                title="Logga ut"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <LogOut size={22} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.iconLink} title="Logga in">
                <User size={22} />
              </Link>
              <Link to="/register" className={styles.iconLink} title="Registrera konto">
                <UserPlus size={22} />
              </Link>
            </>
          )}
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
