"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw new Error(err.message || "Failed to send reset email");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card" style={{textAlign: 'center'}}>
        <h2 className="auth-title">Check your email</h2>
        <p className="error-msg">
          If an account exists for {email}, you will receive a password reset link shortly.
        </p>
        <div className="auth-switch">
          <span onClick={switchToLogin}>Back to Sign In</span>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Reset your password</h2>

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

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-switch">
        Remember your password? <span onClick={switchToLogin}>Back to Sign In</span>
      </div>
    </div>
  );
}
