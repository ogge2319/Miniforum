// CookieBanner.jsx – Banner som frågar användaren om cookie-samtycke (GDPR Art.7)
import { useState, useEffect } from 'react';
import { updateConsents } from '../api/auth';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Kolla om användaren redan har givit samtycke
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setShowBanner(true);
        }
    }, []);

    const handleAcceptAll = async () => {
        // Anropa backend för att spara samtycke
        try {
            await updateConsents(true, true);
        } catch (error) {
            console.log('Backend inte tillgänglig, sparar endast lokalt');
        }

        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const handleRejectAll = async () => {
        try {
            await updateConsents(false, false);
        } catch (error) {
            console.log('Backend inte tillgänglig, sparar endast lokalt');
        }

        localStorage.setItem('cookieConsent', 'rejected');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className={styles.banner}>
            <p>
                Vi använder cookies för att förbättra din upplevelse.
                Du kan läsa mer i vår <a href="/privacy">Privacy Policy</a>.
            </p>
            <div className={styles.buttons}>
                <button
                    className={`${styles.button} ${styles.acceptButton}`}
                    onClick={handleAcceptAll}
                >
                    Acceptera alla
                </button>
                <button
                    className={`${styles.button} ${styles.rejectButton}`}
                    onClick={handleRejectAll}
                >
                    Avvisa alla
                </button>
                <button
                    className={`${styles.button} ${styles.customizeButton}`}
                    onClick={() => setShowBanner(false)}
                >
                    Anpassa
                </button>
            </div>
        </div>
    );
}
