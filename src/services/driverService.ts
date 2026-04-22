import pool from "#db/pool.js";

import { ServiceError } from "./serviceErrors.js";
import { optionalInt, requireInt, requireText } from "./serviceUtils.js";

interface DeliveryDriverRow {
  created_at: string;
  id: number;
  name: string;
  restaurant_id: number;
  updated_at: string;
}

interface DeliveryRunRow {
  created_at: string;
  day_id: number;
  driver_id: number;
  id: number;
  updated_at: string;
}

const listDriversQuery = async (
  restaurantId?: number,
): Promise<DeliveryDriverRow[]> => {
  if (restaurantId === undefined) {
    const result = await pool.query<DeliveryDriverRow>(
      "SELECT id, restaurant_id, name, created_at, updated_at FROM delivery_drivers ORDER BY id",
    );
    return result.rows;
  }

  const result = await pool.query<DeliveryDriverRow>(
    "SELECT id, restaurant_id, name, created_at, updated_at FROM delivery_drivers WHERE restaurant_id = $1 ORDER BY id",
    [restaurantId],
  );
  return result.rows;
};

const listRunsForDriver = async (
  driverId: number,
  dayId?: number,
): Promise<DeliveryRunRow[]> => {
  const clauses = ["driver_id = $1"];
  const params: number[] = [driverId];

  if (dayId !== undefined) {
    params.push(dayId);
    clauses.push("day_id = $" + String(params.length));
  }

  const where = `WHERE ${clauses.join(" AND ")}`;
  const result = await pool.query<DeliveryRunRow>(
    `SELECT id, day_id, driver_id, created_at, updated_at FROM delivery_runs ${where} ORDER BY id`,
    params,
  );
  return result.rows;
};

export const listDriversService = (restaurantIdQuery: unknown) => {
  const restaurantId = optionalInt(restaurantIdQuery, "Invalid restaurant_id");
  return listDriversQuery(restaurantId);
};

export const listDriversForRestaurantService = (restaurantIdParam: unknown) => {
  const restaurantId = requireInt(restaurantIdParam, "Invalid restaurant id");
  return listDriversQuery(restaurantId);
};

export const getDriverService = async (idParam: unknown) => {
  const id = requireInt(idParam, "Invalid driver id");
  const result = await pool.query<DeliveryDriverRow>(
    "SELECT id, restaurant_id, name, created_at, updated_at FROM delivery_drivers WHERE id = $1",
    [id],
  );
  const row = result.rows.at(0);
  if (!row) {
    throw new ServiceError(404, "Driver not found");
  }
  return row;
};

export const createDriverService = async (
  nameInput: unknown,
  restaurantIdInput: unknown,
) => {
  const name = requireText(nameInput, "name is required");
  const restaurantId = requireInt(
    restaurantIdInput,
    "restaurant_id is required",
  );
  const result = await pool.query<DeliveryDriverRow>(
    "INSERT INTO delivery_drivers (name, restaurant_id) VALUES ($1, $2) RETURNING id, restaurant_id, name, created_at, updated_at",
    [name, restaurantId],
  );
  return result.rows[0];
};

export const listDriverRunsService = async (
  driverIdParam: unknown,
  dayIdQuery: unknown,
) => {
  const driverId = requireInt(driverIdParam, "Invalid driver id");
  const dayId = optionalInt(dayIdQuery, "Invalid day_id");
  return listRunsForDriver(driverId, dayId);
};
