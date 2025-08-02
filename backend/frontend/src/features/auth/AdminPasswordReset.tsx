import React, { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
// import { resetPasswordRoute } from '../../routes';
import api from '../../services/api';

export default function AdminPasswordReset() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const search = useSearch({ from: '/reset-password' });

  useEffect(() => {
    const urlToken = search.token;
    if (urlToken) {
      setToken(urlToken);
      setStep(2);
    }
  }, [search.token]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/api/auth/request-password-reset", { email });
      setMessage("Reset email sent. Check your inbox for the token.");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send reset email.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/api/auth/reset-password", { token, newPassword });
      setMessage("Password reset successful.");
      setStep(1);
      setEmail("");
      setToken("");
      setNewPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Password Reset</h2>
      {step === 1 && (
        <form onSubmit={handleRequestReset}>
          <label className="block mb-2">Admin Email</label>
          <input
            type="email"
            className="border p-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Request Reset</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <label className="block mb-2">Reset Token</label>
          <input
            type="text"
            className="border p-2 w-full mb-4"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            readOnly={!!search.token}
          />
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="border p-2 w-full mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Reset Password</button>
        </form>
      )}
      {message && <div className="mt-4 text-green-700">{message}</div>}
      {error && <div className="mt-4 text-red-700">{error}</div>}
    </div>
  );
}
