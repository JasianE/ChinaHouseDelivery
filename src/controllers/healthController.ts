import { checkDbHealth } from "#services/healthService.js";

import { type ApiRequestHandler } from "./controllerUtils.js";

export const healthHandler: ApiRequestHandler = async (_req, res) => {
  try {
    await checkDbHealth();
    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: "Database unavailable", status: "error" });
  }
};
