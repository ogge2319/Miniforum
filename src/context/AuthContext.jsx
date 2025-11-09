// AuthContext.jsx – Håller reda på inloggad användare och hanterar login/logout globalt
import { createContext, useState, useContext, useEffect } from 'react';
import {
    login as loginService,
    logout as logoutService,
    getProfile
} from '../api/auth';

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
        } catch (error) {
            // Det är OK att inte vara inloggad - logga inte error
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await loginService(email, password);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await logoutService();
        setUser(null);
    };

    const value = {
        user,
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
