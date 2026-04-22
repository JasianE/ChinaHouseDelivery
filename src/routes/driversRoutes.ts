import { Router } from "express";

import {
  createDriverHandler,
  getDriverHandler,
  listDriverRunsHandler,
  listDriversHandler,
} from "#controllers/driversController.js";

const router = Router();

router.get("/", listDriversHandler);
router.post("/", createDriverHandler);
router.get("/:id", getDriverHandler);
router.get("/:id/runs", listDriverRunsHandler);

export default router;
