import { ServiceError } from "./serviceErrors.js";

export type OrderStatus = "completed" | "in_progress" | "out_for_run";

const orderStatusSet = new Set<OrderStatus>([
  "completed",
  "in_progress",
  "out_for_run",
]);

const parsePositiveInt = (value: unknown): null | number => {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0) {
      return null;
    }
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      return null;
    }
    const parsed = Number.parseInt(trimmed, 10);
    return parsed > 0 ? parsed : null;
  }

  return null;
};

export const requireInt = (value: unknown, errorMessage: string): number => {
  const parsed = parsePositiveInt(value);
  if (parsed === null) {
    throw new ServiceError(400, errorMessage);
  }
  return parsed;
};

export const optionalInt = (
  value: unknown,
  errorMessage: string,
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = parsePositiveInt(value);
  if (parsed === null) {
    throw new ServiceError(400, errorMessage);
  }
  return parsed;
};

export const requireText = (value: unknown, errorMessage: string): string => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    throw new ServiceError(400, errorMessage);
  }
  return text;
};

export const requireDate = (value: unknown, errorMessage: string): string => {
  const text = requireText(value, errorMessage);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new ServiceError(400, errorMessage);
  }
  return text;
};

export const optionalOrderStatus = (
  value: unknown,
  errorMessage: string,
): OrderStatus | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ServiceError(400, errorMessage);
  }

  const trimmed = value.trim() as OrderStatus;
  if (!orderStatusSet.has(trimmed)) {
    throw new ServiceError(400, errorMessage);
  }

  return trimmed;
};
