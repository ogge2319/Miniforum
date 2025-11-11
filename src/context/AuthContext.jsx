// AuthContext.jsx – Håller reda på inloggad användare och hanterar login/logout globalt
import { createContext, useState, useContext, useEffect } from 'react';
import {
    login as loginService,
    logout as logoutService,
    getProfile
} from '../api/auth';
import { authApi, setCSRFToken, clearCSRFToken, getCSRFToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const data = await getProfile();
            setUser(data.user);
            // Hämta CSRF-token om användaren är inloggad (t.ex. efter sidladdning)
            if (data.user) {
                try {
                    const res = await authApi.get('/csrf-token', { withCredentials: true });
                    setCSRFToken(res.data.csrfToken);
                } catch (err) {
                    console.error('Kunde inte hämta CSRF-token vid checkAuth:', err);
                }
            }
        } catch (error) {
            // Det är OK att inte vara inloggad - logga inte error
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const login = async (email, password) => {
        const data = await loginService(email, password);
        // Hämta CSRF-token direkt efter inloggning
        try {
            const res = await authApi.get('/csrf-token', { withCredentials: true });
            setCSRFToken(res.data.csrfToken);
        } catch (err) {
            console.error('Kunde inte hämta CSRF-token efter login:', err);
        }
        setUser(data.user); // Sätt användaren sist!
        return data;
    };

    const logout = async () => {
        // Om CSRF-token saknas, hämta den först (krävs för skyddad logout)
        if (!getCSRFToken()) {
            try {
                const res = await authApi.get('/csrf-token', { withCredentials: true });
                setCSRFToken(res.data.csrfToken);
            } catch (err) {
                console.error('Kunde inte hämta CSRF-token för logout:', err);
            }
        }
        await logoutService();
        setUser(null);
        // Nollställ CSRF-token efter lyckad utloggning
        clearCSRFToken();
    };

    const value = {
        user,
        setUser, // Exponera setUser globalt
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
