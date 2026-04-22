import {
  createDayService,
  getDayService,
  listDayRunsService,
  listDaysService,
} from "#services/dayService.js";

import {
  type ApiRequestHandler,
  handleControllerError,
} from "./controllerUtils.js";

export const listDaysHandler: ApiRequestHandler = async (_req, res) => {
  try {
    const rows = await listDaysService();
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getDayHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await getDayService(req.params.id);
    res.json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createDayHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await createDayService(req.body?.service_date);
    res.status(201).json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const listDayRunsHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listDayRunsService(req.params.id);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};
