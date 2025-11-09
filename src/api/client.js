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
let csrfToken = null;

// AUTH API - Request Interceptor
authApi.interceptors.request.use(
  async (config) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(config.method.toUpperCase())) {
      if (!csrfToken) {
        try {
          const response = await axios.get('/api/auth/csrf-token', {
            withCredentials: true
          });
          csrfToken = response.data.csrfToken;
        } catch (error) {
          console.error('CSRF token fetch failed:', error);
        }
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
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