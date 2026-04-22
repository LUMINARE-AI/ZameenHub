import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // 🔥 CHANGE TO LOCALHOST FOR DEVELOPMENT
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