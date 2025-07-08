import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwt_decode(storedToken);
        console.log("[AuthContext] Decoded JWT from localStorage:", decoded);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email });
          setRole(decoded.role);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        console.error("[AuthContext] Failed to decode JWT from localStorage:", err);
        logout();
      }
    }
  }, []);

  const login = (jwt) => {
    try {
      const decoded = jwt_decode(jwt);
      console.log("[AuthContext] Decoded JWT on login:", decoded);
      setUser({ id: decoded.id, email: decoded.email });
      setRole(decoded.role);
      setToken(jwt);
      setIsAuthenticated(true);
      localStorage.setItem("token", jwt);
    } catch (err) {
      console.error("[AuthContext] Failed to decode JWT on login:", err);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  // Auto-logout on token expiry
  useEffect(() => {
    if (!token) return;
    const decoded = jwt_decode(token);
    const expiry = decoded.exp * 1000 - Date.now();
    if (expiry > 0) {
      const timer = setTimeout(() => logout(), expiry);
      return () => clearTimeout(timer);
    } else {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 