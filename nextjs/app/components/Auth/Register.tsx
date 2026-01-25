"use client";

import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function Register({ switchToLogin }: { switchToLogin: () => void }) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | string[]>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await auth.register(email, password);
      switchToLogin();
    } catch (err: any) {
      // Backend may return: { errors: [...] } or { message: "..." }
      if (err?.response?.data?.errors) {
        // Extract express-validator error messages
        setError(err.response.data.errors.map((e: any) => e.msg));
      } else {
        setError(err?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Register</h2>

      {/* Show single or multiple error messages */}
      {error &&
        (Array.isArray(error) ? (
          <ul className="error-msg">
            {error.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p className="error-msg">{error}</p>
        ))}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Email:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="auth-field">
          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Create a strong password"
          />
        </div>

        <button type="submit" className="auth-btn">
          Register
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? <span onClick={switchToLogin}>Login here</span>
      </div>
    </div>
  );
}
