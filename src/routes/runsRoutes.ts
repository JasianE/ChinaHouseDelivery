import { Router } from "express";

import {
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

export default router;
