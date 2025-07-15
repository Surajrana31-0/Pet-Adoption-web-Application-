import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On load, check both sessionStorage and localStorage for a token
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    const localToken = localStorage.getItem("token");
    const storedToken = sessionToken || localToken;
    if (storedToken) {
      try {
        const decoded = jwt_decode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email });
          setRole(decoded.role);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  }, []);

  // login now takes a second argument: rememberMe
  const login = (jwt, rememberMe) => {
    try {
      const decoded = jwt_decode(jwt);
      setUser({ id: decoded.id, email: decoded.email });
      setRole(decoded.role);
      setToken(jwt);
      setIsAuthenticated(true);
      // Store in chosen storage
      if (rememberMe) {
        localStorage.setItem("token", jwt);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", jwt);
        localStorage.removeItem("token");
      }
    } catch (err) {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
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