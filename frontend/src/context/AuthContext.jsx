import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function bootstrap() {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (_error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    setUser(response.data.user);
    return response.data.user;
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, logout, refresh: bootstrap }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used in AuthProvider");
  return context;
}
