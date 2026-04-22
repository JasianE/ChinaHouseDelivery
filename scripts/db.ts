import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import pool from "../src/db/pool.js";

type DbMode = "migrate" | "seed";

const mode = process.argv[2] as DbMode | undefined;

const rootDir = process.cwd();
const migrationsDir = path.join(rootDir, "db", "migrations");
const seedsDir = path.join(rootDir, "db", "seeds");

const ensureMigrationsTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS db_migrations (filename TEXT PRIMARY KEY, run_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  );
};

const runSqlFile = async (filePath: string) => {
  const sql = await readFile(filePath, "utf-8");
  if (!sql.trim()) {
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getSqlFiles = async (dirPath: string) => {
  const files = await readdir(dirPath);
  return files.filter((file) => file.endsWith(".sql")).sort();
};

const migrate = async () => {
  await ensureMigrationsTable();
  const files = await getSqlFiles(migrationsDir);

  for (const file of files) {
    const result = await pool.query(
      "SELECT 1 FROM db_migrations WHERE filename = $1",
      [file],
    );

    if (result.rowCount && result.rowCount > 0) {
      continue;
    }

    await runSqlFile(path.join(migrationsDir, file));
    await pool.query("INSERT INTO db_migrations (filename) VALUES ($1)", [
      file,
    ]);
  }
};

const seed = async () => {
  const files = await getSqlFiles(seedsDir);
  for (const file of files) {
    await runSqlFile(path.join(seedsDir, file));
  }
};

const run = async () => {
  if (mode === "migrate") {
    await migrate();
    return;
  }

  if (mode === "seed") {
    await seed();
    return;
  }

  throw new Error("Usage: tsx scripts/db.ts <migrate|seed>");
};

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
