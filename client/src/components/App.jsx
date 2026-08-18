import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";

export default function App() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (user) return <Chat />;

  return showRegister ? (
    <Register switchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login switchToRegister={() => setShowRegister(true)} />
  );
}
