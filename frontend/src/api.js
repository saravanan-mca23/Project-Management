// frontend/src/api.js
import axios from "axios";

// Use Vite environment variable
const API = axios.create({
  baseURL:"https://pms-backend-vzh1.onrender.com/api", // backend base URL
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
