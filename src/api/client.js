// client.js – Grundinställning för Axios (baseURL, cookies, felhantering)

import axios from "axios";

export const api = axios.create({
  baseURL: "/",                 // eller din backend-url senare
  withCredentials: true,        // viktigt för cookies/JWT om ni använder det
});

// (valfritt) gemensam felhantering
api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);
