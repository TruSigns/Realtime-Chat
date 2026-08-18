import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { connectSocket, disconnectSocket } from "../services/socket";

export default function Chat() {
  const { token, user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on("history", (msgs) => setMessages(msgs));
    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("user_joined", ({ username }) => setNotice(`${username} joined`));
    socket.on("user_left", ({ username }) => setNotice(`${username} left`));

    return () => disconnectSocket();
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current.emit("send_message", input);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>
          Chat — <span className="username">{user.username}</span>
        </h2>
        <button className="logout-button" onClick={logout}>
          Log out
        </button>
      </div>

      {notice && <p className="chat-notice">{notice}</p>}

      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message-bubble ${m.username === user.username ? "own" : ""}`}
          >
            <span className="message-sender">{m.username}</span>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-row" onSubmit={sendMessage}>
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
