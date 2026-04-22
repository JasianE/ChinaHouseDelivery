import { Router } from "express";

import {
  createOrderHandler,
  deleteOrderHandler,
  getOrderHandler,
  getRunOrderHandler,
  listOrdersHandler,
} from "#controllers/ordersController.js";

const router = Router();

router.get("/", listOrdersHandler);
router.post("/", createOrderHandler);
router.get("/:id", getOrderHandler);
router.delete('/', deleteOrderHandler);
router.get("/orderRuns/:id", getRunOrderHandler);

export default router;
