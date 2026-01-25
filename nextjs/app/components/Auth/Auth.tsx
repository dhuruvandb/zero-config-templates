"use client";

import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

export function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      {mode === "login" && (
        <Login switchToRegister={() => setMode("register")} />
      )}

      {mode === "register" && (
        <Register switchToLogin={() => setMode("login")} />
      )}
    </>
  );
}
