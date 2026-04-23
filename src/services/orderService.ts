import pool from "#db/pool.js";
import { DeliveryOrderRow } from "#interfaces/interfaces.js";

import { ServiceError } from "./serviceErrors.js";
import {
  optionalInt,
  optionalOrderStatus,
  type OrderStatus,
  requireInt,
  requireText,
} from "./serviceUtils.js";



interface OrderFilters {
  runId?: number;
  status?: OrderStatus;
}

const listOrdersQuery = async (
  filters: OrderFilters = {},
): Promise<DeliveryOrderRow[]> => {
  const clauses: string[] = [];
  const params: (number | OrderStatus)[] = [];

  if (filters.runId !== undefined) {
    params.push(filters.runId);
    clauses.push("run_id = $" + String(params.length));
  }

  if (filters.status !== undefined) {
    params.push(filters.status);
    clauses.push("status = $" + String(params.length));
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await pool.query<DeliveryOrderRow>(
    `SELECT id, run_id, order_number, address_value, status, created_at, updated_at FROM delivery_orders ${where} ORDER BY id`,
    params,
  );
  return result.rows;
};

export const listOrdersService = (
  runIdQuery: unknown,
  statusQuery: unknown,
) => {
  const runId = optionalInt(runIdQuery, "Invalid run_id");
  const status = optionalOrderStatus(statusQuery, "Invalid status");
  return listOrdersQuery({ runId, status });
};

export const listRunOrdersService = (
  runIdParam: unknown,
  statusQuery: unknown,
) => {
  const runId = requireInt(runIdParam, "Invalid run id");
  const status = optionalOrderStatus(statusQuery, "Invalid status");
  return listOrdersQuery({ runId, status });
};

export const getOrderService = async (idParam: unknown) => {
  const id = requireInt(idParam, "Invalid order id");
  const result = await pool.query<DeliveryOrderRow>(
    "SELECT id, run_id, order_number, address_value, status, created_at, updated_at FROM delivery_orders WHERE id = $1",
    [id],
  );
  const row = result.rows.at(0);
  if (!row) {
    throw new ServiceError(404, "Order not found");
  }
  return row;
};

export const getAllRunOrdersService = async (idParam: unknown) => {
  const runId = requireInt(idParam, "Invalid run id");

  const result = await pool.query<DeliveryOrderRow>(
    "SELECT id, run_id, order_number, address_value, status, created_at, updated_at FROM delivery_orders WHERE run_id = $1",
    [runId],
  );
  return result.rows;
};

export const createOrderService = async (
  runIdInput: unknown,
  orderNumberInput: unknown,
  address_value: unknown,
  statusInput: unknown,
) => {
  const runId = requireInt(runIdInput, "run_id is required");
  const orderNumber = requireInt(orderNumberInput, "order_number is required");
  const address = requireText(address_value, "address value is required");

  const status =
    optionalOrderStatus(statusInput, "Invalid status") ?? "in_progress";

  const result = await pool.query<DeliveryOrderRow>(
    "INSERT INTO delivery_orders (run_id, order_number, address_value, status) VALUES ($1, $2, $3, $4) RETURNING id, run_id, order_number, address_value, status, created_at, updated_at",
    [runId, orderNumber, address, status],
  );
  return result.rows[0];
};

export const deleteOrderService = async (
  runIdInput: unknown,
  orderNumberInput: unknown,
) => {
  const runId = requireInt(runIdInput, "run_id is required");
  //const orderNumber = requireInt(orderNumberInput, "order_number is required");
  const orderNumber = orderNumberInput;
  const result = await pool.query<DeliveryOrderRow>(
    "DELETE FROM delivery_orders WHERE run_id = $1 AND order_number = $2 RETURNING id, run_id, order_number, status, created_at, updated_at",
    [runId, orderNumber],
  );

  return result.rows[0];
};
