"use client";

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load token from localStorage on mount
    const token = localStorage.getItem("token");
    if (token) {
      setAccessToken(token);
    }
    setIsLoaded(true);
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.accessToken) throw new Error(data.message || "Login failed");

    setAccessToken(data.accessToken);
    localStorage.setItem("token", data.accessToken);
  }

  async function register(email: string, password: string): Promise<any> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.accessToken) {
      throw new Error(data.message);
    } else {
      return data;
    }
  }

  function logout() {
    setAccessToken(null);
    localStorage.removeItem("token");
  }

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
