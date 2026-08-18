import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
