import { Pool } from "pg";

const pool = new Pool({
  database: process.env.DB_NAME ?? "chinahouse",
  host: process.env.DB_HOST ?? "localhost",
  password: process.env.DB_PASSWORD ?? "chinahouse_dev",
  port: Number(process.env.DB_PORT ?? 5432),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
  user: process.env.DB_USER ?? "chinahouse",
});

export default pool;
