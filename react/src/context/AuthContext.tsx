import { createContext } from "react";
import type { ReactNode } from "react";
import { authClient } from "../lib/auth-client";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  async function login(email: string, password: string) {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || "Login failed");
  }

  async function register(email: string, password: string) {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0],
    });
    if (error) throw new Error(error.message || "Registration failed");
  }

  function logout() {
    authClient.signOut();
  }

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
