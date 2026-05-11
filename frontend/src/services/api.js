import axios from "axios";
import { clearSession, getStoredToken } from "../utils/auth";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV
      ? "http://localhost:8000/api"
      : "https://backend-3rsf.onrender.com/api"),
});

API.interceptors.request.use((request) => {
  const token = getStoredToken();

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);

export default API;
