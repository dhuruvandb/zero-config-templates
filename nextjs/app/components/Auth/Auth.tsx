"use client";

import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import { ForgotPassword } from "./ForgotPassword";

export function Auth() {
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");

  return (
    <>
      {mode === "login" && (
        <Login
          switchToRegister={() => setMode("register")}
          switchToForgotPassword={() => setMode("forgot-password")}
        />
      )}

      {mode === "register" && (
        <Register switchToLogin={() => setMode("login")} />
      )}

      {mode === "forgot-password" && (
        <ForgotPassword switchToLogin={() => setMode("login")} />
      )}
    </>
  );
}
