import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./style.css";

export function Login({ switchToRegister }: { switchToRegister: () => void }) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login</h2>

      {error && <p className="error-msg">{error}</p>}

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
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-btn">
          Login
        </button>
      </form>

      <div className="auth-switch">
        New user? <span onClick={switchToRegister}>Create an account</span>
      </div>
    </div>
  );
}
