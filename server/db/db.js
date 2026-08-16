// Central Postgres connection pool. Everything that touches the DB
// imports this rather than creating its own client.
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  // Catches errors on idle clients so a bad connection doesn't crash the process
  console.error("Unexpected Postgres error", err);
});

module.exports = pool;
