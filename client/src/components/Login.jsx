import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login({ switchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      {error && <p className="auth-error">{error}</p>}
      <input
        className="auth-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" type="submit">
        Log in
      </button>
      <p className="auth-switch glow" onClick={switchToRegister}>
        Need an account? Register
      </p>
    </form>
  );
}
