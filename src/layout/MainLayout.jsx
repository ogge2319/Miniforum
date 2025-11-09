import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";
import CookieBanner from "../components/CookieBanner";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children }) {
  return (
    <div className={styles.appLayout}>
      {/* Twitter-lik Header med temaväxling */}
      <Header />

      {/* Huvudinnehåll (centrerad feed) */}
      <main className={styles.main}>
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <small>© 2025 MiniForum – Demo</small>
        <div className={styles.footerLinks}>
          <Link to="/privacy">Privacy & Cookies</Link>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
