import pool from "#db/pool.js";

export const checkDbHealth = async (): Promise<void> => {
  await pool.query("SELECT 1");
};
