const jwt = require("jsonwebtoken");
const db = require("../db/db");

function initChatSocket(io) {
  // Auth middleware for socket connections — runs before 'connection' fires
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Invalid token"));
      socket.user = decoded; // { id, username }
      next();
    });
  });

  io.on("connection", async (socket) => {
    console.log(`${socket.user.username} connected`);

    // Send last 50 messages so the client has history on load
    try {
      const history = await db.query(
        "SELECT id, username, content, created_at FROM messages ORDER BY created_at DESC LIMIT 50",
      );
      socket.emit("history", history.rows.reverse());
    } catch (err) {
      console.error("Failed to load history", err);
    }

    socket.broadcast.emit("user_joined", { username: socket.user.username });

    socket.on("send_message", async (content) => {
      if (!content || typeof content !== "string" || !content.trim()) return;

      try {
        const result = await db.query(
          "INSERT INTO messages (user_id, username, content) VALUES ($1, $2, $3) RETURNING id, username, content, created_at",
          [socket.user.id, socket.user.username, content.trim()],
        );
        io.emit("new_message", result.rows[0]); // broadcast to everyone, including sender
      } catch (err) {
        console.error("Failed to save message", err);
      }
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user_left", { username: socket.user.username });
    });
  });
}

module.exports = { initChatSocket };
