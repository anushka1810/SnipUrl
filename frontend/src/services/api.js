// src/services/api.js
// Axios HTTP client configuration and API service functions

import axios from "axios";

// Backend base URL
const BACKEND_BASE = "http://localhost:5000";

// Create a dedicated Axios instance pointing to our backend API
const api = axios.create({
  baseURL: `${BACKEND_BASE}/api/url`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Shorten a long URL
 * @param {string} longUrl - The original URL to shorten
 * @returns {Promise<{shortUrl, shortCode, longUrl, clicks, createdAt}>}
 */
export const shortenUrl = async (longUrl) => {
  const response = await api.post("/shorten", { longUrl });
  return response.data;
};

/**
 * Returns the full backend redirect URL for a short code.
 * RedirectHandler uses window.location.href = this URL so the
 * browser itself follows the 302 redirect — no Axios needed.
 * @param {string} code - The 7-character short code
 * @returns {string} Full backend URL that will redirect to the long URL
 */
export const getRedirectUrl = (code) => {
  return `${BACKEND_BASE}/api/url/${code}`;
};

export default api;
