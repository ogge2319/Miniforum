import axios from "axios";

// AUTH API - Via Vite proxy
export const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// DOMAIN API - Via Vite proxy
export const domainApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// CSRF Token Management
export let csrfToken = null;
export function setCSRFToken(token) { csrfToken = token; }
export function clearCSRFToken() { csrfToken = null; }
export function getCSRFToken() { return csrfToken; }

// AUTH API - Request Interceptor

authApi.interceptors.request.use(
  async (config) => {
    const method = config.method.toUpperCase();
    const url = config.url;
    // Skippa CSRF för login, register och csrf-token
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(method) &&
      !url.endsWith('/login') &&
      !url.endsWith('/register') &&
      !url.endsWith('/csrf-token')
    ) {
      if (!csrfToken) {
        throw new Error('Ingen CSRF-token – användaren måste vara inloggad och ha hämtat token!');
      }
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH API - Response Interceptor
authApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 403) {
      csrfToken = null;
    }
    // Logga inte 401 errors - det är normalt att inte vara inloggad
    if (err.response?.status === 401) {
      // Gör ingenting - användaren är bara inte inloggad
    } else {
      console.error("Auth API error:", err.response?.data || err.message);
    }
    return Promise.reject(err);
  }
);

// DOMAIN API - Response Interceptor
domainApi.interceptors.response.use(
  (r) => r,
  (err) => {
    // Logga inte 401 errors
    if (err.response?.status !== 401) {
      console.error("Domain API error:", err.response?.data || err.message);
    }
    return Promise.reject(err);
  }
);