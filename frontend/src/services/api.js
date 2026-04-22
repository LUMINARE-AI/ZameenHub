import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-3rsf.onrender.com", // 🔥 CHANGE TO LOCALHOST FOR DEVELOPMENT
});

// 🔥 IMPORTANT INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;