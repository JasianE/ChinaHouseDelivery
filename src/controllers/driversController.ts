import {
  createDriverService,
  getDriverService,
  listDriverRunsService,
  listDriversService,
} from "#services/driverService.js";

import {
  type ApiRequestHandler,
  handleControllerError,
} from "./controllerUtils.js";

export const listDriversHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listDriversService(req.query.restaurant_id);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getDriverHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await getDriverService(req.params.id);
    res.json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createDriverHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await createDriverService(
      req.body?.name,
      req.body?.restaurant_id,
    );
    res.status(201).json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const listDriverRunsHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listDriverRunsService(req.params.id, req.query.day_id);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};
