import { Router } from "express";

import {
  createDayHandler,
  getDayHandler,
  listDayRunsHandler,
  listDaysHandler,
} from "#controllers/daysController.js";

const router = Router();

router.get("/", listDaysHandler);
router.post("/", createDayHandler);
router.get("/:id", getDayHandler);
router.get("/:id/runs", listDayRunsHandler);

export default router;
