const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const router = express.Router();
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, age, username, password } = req.body;

  if (!firstName || !lastName || !email || !age || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const ageNum = Number(age);
  if (!Number.isInteger(ageNum) || ageNum < 13 || ageNum > 120) {
    return res
      .status(400)
      .json({ error: "Age must be a number between 13 and 120" });
  }

  try {
    const existing = await db.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email],
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, age, username, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, age, username`,
      [firstName, lastName, email, ageNum, username, passwordHash],
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
