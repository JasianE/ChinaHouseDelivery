import pool from "#db/pool.js";

import { ServiceError } from "./serviceErrors.js";
import { requireInt, requireText } from "./serviceUtils.js";

interface RestaurantRow {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

export const listRestaurantsService = async () => {
  const result = await pool.query<RestaurantRow>(
    "SELECT id, name, created_at, updated_at FROM restaurants ORDER BY id",
  );
  return result.rows;
};

export const getRestaurantService = async (idParam: unknown) => {
  const id = requireInt(idParam, "Invalid restaurant id");
  const result = await pool.query<RestaurantRow>(
    "SELECT id, name, created_at, updated_at FROM restaurants WHERE id = $1",
    [id],
  );
  const row = result.rows.at(0);
  if (!row) {
    throw new ServiceError(404, "Restaurant not found");
  }
  return row;
};

export const createRestaurantService = async (nameInput: unknown) => {
  const name = requireText(nameInput, "name is required");
  const result = await pool.query<RestaurantRow>(
    "INSERT INTO restaurants (name) VALUES ($1) RETURNING id, name, created_at, updated_at",
    [name],
  );
  return result.rows[0];
};
