import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "compumundohipermegared",
  port: "5433",
});

module.exports = pool;
