import type { RequestHandler, Response } from "express";

import { ServiceError } from "#services/serviceErrors.js";

export type ApiRequestHandler = RequestHandler<
  Record<string, string>,
  unknown,
  Record<string, unknown> | undefined,
  Record<string, unknown>
>;

export const handleControllerError = (res: Response, error: unknown): void => {
  if (error instanceof ServiceError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  const code = (error as { code?: string }).code;
  if (code === "23505") {
    res.status(409).json({ error: "Duplicate record" });
    return;
  }

  if (code === "23503") {
    res.status(400).json({ error: "Invalid reference" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};
