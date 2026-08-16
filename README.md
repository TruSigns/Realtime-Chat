README.md (place at project root)
markdown
# Realtime Chat

A full-stack real-time chat application with authentication, built with React, Express, Socket.io, and PostgreSQL (via Supabase).

## Tech Stack

**Client**
- React 18
- Webpack 5 (custom config, no CRA)
- Socket.io Client
- Axios

**Server**
- Node.js + Express
- Socket.io
- PostgreSQL (Supabase)
- JWT authentication
- bcrypt for password hashing

## Features

- User registration with first name, last name, email, age, username, and password
- JWT-based authentication
- Real-time messaging via WebSockets
- Message persistence — chat history loads on reconnect
- Live "user joined / left" notifications

## Project Structure

realtime-chat-app/
client/ # React + Webpack frontend
src/
components/ # Login, Register, Chat, App
context/ # AuthContext (global auth state)
services/ # API client, socket connection
server/ # Express + Socket.io backend
routes/ # Auth endpoints (register, login)
socket/ # Socket.io connection + chat logic
middleware/ # JWT verification
db/ # Database connection + schema


## Setup

### 1. Database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the contents of `server/db/schema.sql` to create the `users` and `messages` tables.
3. Get your connection string: **Connect → Session pooler → URI** (use the session/transaction pooler, not the direct connection, for IPv4 compatibility).

### 2. Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your real values:

PORT=4000
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=any_long_random_string
CLIENT_ORIGIN=http://localhost:8080


Start the server:

```bash
npm run dev
```

### 3. Client

```bash
cd client
npm install
npm start
```

Open [http://localhost:8080](http://localhost:8080).

## Notes

- `client` and `server` are independent Node projects — install and run each separately (two terminal windows).
- Never commit `.env` — it contains your database credentials and JWT secret. It's already covered by the root `.gitignore`.
To apply it
