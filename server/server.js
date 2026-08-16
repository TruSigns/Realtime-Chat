require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const { initChatSocket } = require("./socket/chat");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

initChatSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
