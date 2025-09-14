// frontend/src/context/AuthContext.js
import { createContext, useState, useContext } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Register
  const register = async (name, email, password, role) => {
    const res = await API.post("/auth/register", { name, email, password, role });
    const userData = res.data.user || res.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return userData;
  };

  // Login
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const userData = res.data.user || res.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return userData;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
