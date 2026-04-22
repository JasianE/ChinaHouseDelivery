import { Router } from "express";

import {
  createRestaurantHandler,
  getRestaurantHandler,
  listRestaurantDriversHandler,
  listRestaurantsHandler,
} from "#controllers/restaurantsController.js";

const router = Router();

router.get("/", listRestaurantsHandler);
router.post("/", createRestaurantHandler);
router.get("/:id", getRestaurantHandler);
router.get("/:id/drivers", listRestaurantDriversHandler);

export default router;
