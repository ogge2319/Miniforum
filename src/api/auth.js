// auth.js – API-anrop för inloggning, registrering, utloggning och token-refresh
import { authApi } from './client';

export const register = async (email, password, name) => {
    const response = await authApi.post('/register', {
        email,
        password,
        name,
        consents: {
            marketing: false,
            analytics: false
        }
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await authApi.post('/login', {
        email,
        password
    });
    return response.data;
};

export const logout = async () => {
    const response = await authApi.post('/logout');
    return response.data;
};

export const getProfile = async () => {
    const response = await authApi.get('/profile');
    return response.data;
};

export const exportData = async () => {
    const response = await authApi.get('/export');

    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
};

export const deleteAccount = async (password) => {
    const response = await authApi.delete('/account', {
        data: { password }
    });
    return response.data;
};

export const getConsents = async () => {
    const response = await authApi.get('/consents');
    return response.data;
};

export const updateConsents = async (marketing, analytics) => {
    const response = await authApi.put('/consents', {
        marketing,
        analytics
    });
    return response.data;
};

export const getPrivacyPolicy = async () => {
    const response = await authApi.get('/privacy-policy');
    return response.data;
};

export const toggleFollow = async (userId) => {
    const response = await authApi.post(`/follow/${userId}`);
    return response.data;
};

export const getFollowers = async (userId) => {
    const response = await authApi.get(`/users/${userId}/followers`);
    return response.data;
};

export const getFollowing = async (userId) => {
    const response = await authApi.get(`/users/${userId}/following`);
    return response.data;
};
