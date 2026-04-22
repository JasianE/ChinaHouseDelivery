import { Router } from "express";

import {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
} from "#controllers/ordersController.js";

const router = Router();

router.get("/", listOrdersHandler);
router.post("/", createOrderHandler);
router.get("/:id", getOrderHandler);

export default router;
