import pool from "#db/pool.js";
import { DeliveryOrderRow } from "#interfaces/interfaces.js";

import { ServiceError } from "./serviceErrors.js";
import { optionalInt, requireInt } from "./serviceUtils.js";

interface DeliveryRunRow {
  created_at: string;
  day_id: number;
  driver_id: number;
  id: number;
  updated_at: string;
}

const listRunsQuery = async (
  driverId?: number,
  dayId?: number,
): Promise<DeliveryRunRow[]> => {
  const clauses: string[] = [];
  const params: number[] = [];

  if (driverId !== undefined) {
    params.push(driverId);
    clauses.push("driver_id = $" + String(params.length));
  }

  if (dayId !== undefined) {
    params.push(dayId);
    clauses.push("day_id = $" + String(params.length));
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await pool.query<DeliveryRunRow>(
    `SELECT id, day_id, driver_id, created_at, updated_at FROM delivery_runs ${where} ORDER BY id`,
    params,
  );
  return result.rows;
};

export const listRunsService = (
  driverIdQuery: unknown,
  dayIdQuery: unknown,
) => {
  const driverId = optionalInt(driverIdQuery, "Invalid driver_id");
  const dayId = optionalInt(dayIdQuery, "Invalid day_id");
  return listRunsQuery(driverId, dayId);
};

export const getRunService = async (idParam: unknown) => {
  const id = requireInt(idParam, "Invalid run id");
  const result = await pool.query<DeliveryRunRow>(
    "SELECT id, day_id, driver_id, created_at, updated_at FROM delivery_runs WHERE id = $1",
    [id],
  );
  const row = result.rows.at(0);
  if (!row) {
    throw new ServiceError(404, "Run not found");
  }
  return row;
};

export const createRunService = async (
  dayIdInput: unknown,
  driverIdInput: unknown,
) => {
  const dayId = requireInt(dayIdInput, "day_id is required");
  const driverId = requireInt(driverIdInput, "driver_id is required");
  const result = await pool.query<DeliveryRunRow>(
    "INSERT INTO delivery_runs (day_id, driver_id) VALUES ($1, $2) RETURNING id, day_id, driver_id, created_at, updated_at",
    [dayId, driverId],
  );
  return result.rows[0];
};

export const calculateBestPathService = async (
  runIdInput: unknown,
) => {
  const runId = requireInt(runIdInput, "run_id is required");

  const result = await pool.query<DeliveryOrderRow>(
    "SELECT id, run_id, order_number, address_value, status, created_at, updated_at FROM delivery_orders WHERE run_id = $1",
    [runId],
  );
  
  const addresses = result.rows.map((key : DeliveryOrderRow) => key.address_value);
  console.log(addresses)
  // do something w/ writing sql manually, then getting all those addresses and then inputting them into google maps api or something, then that will generate the best route and a link to it, i guess?
};