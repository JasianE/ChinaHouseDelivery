import pool from "#db/pool.js";

import { ServiceError } from "./serviceErrors.js";
import { requireDate, requireInt } from "./serviceUtils.js";

interface DayRow {
  created_at: string;
  id: number;
  service_date: string;
  updated_at: string;
}

interface DeliveryRunRow {
  created_at: string;
  day_id: number;
  driver_id: number;
  id: number;
  updated_at: string;
}

export const listDaysService = async () => {
  const result = await pool.query<DayRow>(
    "SELECT id, service_date, created_at, updated_at FROM days ORDER BY service_date",
  );
  return result.rows;
};

export const getDayService = async (idParam: unknown) => {
  const id = requireInt(idParam, "Invalid day id");
  const result = await pool.query<DayRow>(
    "SELECT id, service_date, created_at, updated_at FROM days WHERE id = $1",
    [id],
  );
  const row = result.rows.at(0);
  if (!row) {
    throw new ServiceError(404, "Day not found");
  }
  return row;
};

export const createDayService = async (serviceDateInput: unknown) => {
  const serviceDate = requireDate(
    serviceDateInput,
    "service_date must be YYYY-MM-DD",
  );
  const result = await pool.query<DayRow>(
    "INSERT INTO days (service_date) VALUES ($1) RETURNING id, service_date, created_at, updated_at",
    [serviceDate],
  );
  return result.rows[0];
};

export const listDayRunsService = async (dayIdParam: unknown) => {
  const dayId = requireInt(dayIdParam, "Invalid day id");
  const result = await pool.query<DeliveryRunRow>(
    "SELECT id, day_id, driver_id, created_at, updated_at FROM delivery_runs WHERE day_id = $1 ORDER BY id",
    [dayId],
  );
  return result.rows;
};
