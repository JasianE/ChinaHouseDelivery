import { listRunOrdersService } from "#services/orderService.js";
import {
  createRunService,
  getRunService,
  listRunsService,
} from "#services/runService.js";

import {
  type ApiRequestHandler,
  handleControllerError,
} from "./controllerUtils.js";

export const listRunsHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listRunsService(req.query.driver_id, req.query.day_id);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getRunHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await getRunService(req.params.id);
    res.json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createRunHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await createRunService(req.body?.day_id, req.body?.driver_id);
    res.status(201).json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const listRunOrdersHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listRunOrdersService(req.params.id, req.query.status);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};
