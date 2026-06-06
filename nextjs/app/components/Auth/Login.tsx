"use client";

import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { authClient } from "@/lib/auth-client";

export function Login({
  switchToRegister,
  switchToForgotPassword,
}: {
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
}) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      setSocialLoading(null);
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

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="auth-social">
        <p className="auth-or">Or continue with</p>
        <div className="auth-social-buttons">
          <button
            type="button"
            className="auth-btn auth-social-btn"
            disabled={socialLoading === 'google'}
            onClick={() => handleSocialLogin('google')}
          >
            {socialLoading === 'google' ? 'Redirecting...' : 'Google'}
          </button>
          <button
            type="button"
            className="auth-btn auth-social-btn"
            disabled={socialLoading === 'github'}
            onClick={() => handleSocialLogin('github')}
          >
            {socialLoading === 'github' ? 'Redirecting...' : 'GitHub'}
          </button>
        </div>
      </div>

      <div className="auth-switch">
        <span onClick={switchToForgotPassword}>Forgot password?</span>
      </div>

      <div className="auth-switch">
        New user? <span onClick={switchToRegister}>Create an account</span>
      </div>
    </div>
  );
}
