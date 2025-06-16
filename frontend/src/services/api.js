// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Make sure this matches your backend API
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT), // Increased timeout for file uploads
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Add the Bearer prefix explicitly
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Important: Don't set Content-Type for FormData/file uploads
    // If FormData is detected, let the browser set the Content-Type with proper boundaries
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      // Default to JSON for regular requests
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
