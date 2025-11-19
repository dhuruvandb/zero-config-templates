import { createContext, useState, ReactNode } from "react";
import api from "../api/api";

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  async function login(email: string, password: string) {
    const res = await api.post("/api/auth/login", { email, password });

    if (!res.accessToken) throw new Error(res.message || "Login failed");

    setAccessToken(res.accessToken);
    localStorage.setItem("token", res.accessToken);
  }

  async function register(email: string, password: string) {
    const res = await api.post("/api/auth/register", { email, password });
    if (!res.success) throw new Error(res.message || "Registration failed");
  }

  function logout() {
    setAccessToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
