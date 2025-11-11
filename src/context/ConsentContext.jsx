// ConsentContext.jsx – Sparar användarens cookie-/samtyckesval globalt i appen
import { createContext, useContext, useEffect, useState } from "react";
import { getConsents, updateConsents } from "../api/auth.js"
import { useAuth } from "./AuthContext";

const ConsentContext = createContext();

export const ConsentProvider = ({ children }) => {
    const [consents, setConsents] = useState({
        marketing: false,
        analytics: false,
    });

    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState();
    const { user } = useAuth();

    // Hämta consents när en användare loggar in, och nollställ om user är null
    useEffect(() => {
        if (!user) {
            setConsents({ marketing: false, analytics: false });
            setLogs([]);
            setLoading(false);
            return;
        }
        const fetchConsent = async () => {
            try {
                const data = await getConsents();
                setConsents(data.consents);
                setLogs(data.consentLogs || []);
                localStorage.setItem("consents", JSON.stringify(data.consents));
            } catch (err) {
                console.warn("Kunde inte hämta consents, använder lokalt sparade:", err)
                const cached = localStorage.getItem("consents");
                if (cached) setConsents(JSON.parse(cached));
            } finally {
                setLoading(false);
            };
        };
        fetchConsent();
    }, [user]);

    //Uppdatera både lokalt och i backend
    const savedConsents = async (newConsents) => {
        setConsents(newConsents);
        localStorage.setItem("consents", JSON.stringify(newConsents));
        try {
            await updateConsents(newConsents.marketing, newConsents.analytics);
        } catch (err) {
            console.error("Misslyckades att uppdatera consents:", err);
        }
        savedConsents();
    };
    return (
        <ConsentContext.Provider value={{ consents, setConsents: savedConsents, logs, loading }}

        >
            {children}
        </ConsentContext.Provider>

    );
};
export const useConsent = () => useContext(ConsentContext);