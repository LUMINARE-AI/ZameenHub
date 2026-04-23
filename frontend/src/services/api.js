import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://backend-3rsf.onrender.com/api",
});

API.interceptors.request.use((request) => {
  const token = getStoredToken();

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export default API;
