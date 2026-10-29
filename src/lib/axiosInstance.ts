import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Centralized Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 1. Request Interceptor: Automatically injects JWT Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catches 401 Unauthorized & cleanly logs out
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-logout if the request was from the login endpoint itself
      const requestUrl = error.config?.url || "";
      if (!requestUrl.includes("/login") && !requestUrl.includes("/register")) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

// Helper for image URLs (handles external URLs and backend local upload paths)
export const getImageUrl = (path?: string | null): string => {
  if (!path) return "/placeholder-property.png";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
};

export default axiosInstance;
export const api = axiosInstance;
export { API_BASE_URL };
