import { listDriversForRestaurantService } from "#services/driverService.js";
import {
  createRestaurantService,
  getRestaurantService,
  listRestaurantsService,
} from "#services/restaurantService.js";

import {
  type ApiRequestHandler,
  handleControllerError,
} from "./controllerUtils.js";

export const listRestaurantsHandler: ApiRequestHandler = async (_req, res) => {
  try {
    const rows = await listRestaurantsService();
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getRestaurantHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await getRestaurantService(req.params.id);
    res.json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createRestaurantHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await createRestaurantService(req.body?.name);
    res.status(201).json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const listRestaurantDriversHandler: ApiRequestHandler = async (
  req,
  res,
) => {
  try {
    const rows = await listDriversForRestaurantService(req.params.id);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};
