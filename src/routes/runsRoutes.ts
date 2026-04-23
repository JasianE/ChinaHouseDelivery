import { Router } from "express";

import {
  calculateBestPathHandler,
  createRunHandler,
  getRunHandler,
  listRunOrdersHandler,
  listRunsHandler,
} from "#controllers/runsController.js";

const router = Router();

router.get("/", listRunsHandler);
router.post("/", createRunHandler);
router.get("/:id", getRunHandler);
router.get("/:id/orders", listRunOrdersHandler);
router.get('/calculate/:id', calculateBestPathHandler);

export default router;
