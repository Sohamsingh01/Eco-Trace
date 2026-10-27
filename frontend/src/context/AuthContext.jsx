import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("ecotrace_token"));
  const [loading, setLoading] = useState(true);

  // Initialize and check persistent session
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem("ecotrace_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.removeItem("ecotrace_token");
        localStorage.removeItem("ecotrace_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem("ecotrace_token", res.access_token);
    setToken(res.access_token);
    
    // Fetch full profile details
    const fullProfile = await api.getMe();
    setUser(fullProfile);
    localStorage.setItem("ecotrace_user", JSON.stringify(fullProfile));
    return fullProfile;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem("ecotrace_token", res.access_token);
    setToken(res.access_token);

    const fullProfile = await api.getMe();
    setUser(fullProfile);
    localStorage.setItem("ecotrace_user", JSON.stringify(fullProfile));
    return fullProfile;
  };

  const logout = () => {
    localStorage.removeItem("ecotrace_token");
    localStorage.removeItem("ecotrace_user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const freshUser = await api.getMe();
      setUser(freshUser);
      localStorage.setItem("ecotrace_user", JSON.stringify(freshUser));
      return freshUser;
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const updateLocalUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("ecotrace_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
