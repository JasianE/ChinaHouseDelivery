import {
  createOrderService,
  deleteOrderService,
  getOrderService,
  listOrdersService,
} from "#services/orderService.js";

import {
  type ApiRequestHandler,
  handleControllerError,
} from "./controllerUtils.js";


export const listOrdersHandler: ApiRequestHandler = async (req, res) => {
  try {
    const rows = await listOrdersService(req.query.run_id, req.query.status);
    res.json(rows);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getOrderHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await getOrderService(req.params.id);
    res.json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createOrderHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await createOrderService(
      req.body?.run_id,
      req.body?.order_number,
      req.body?.status,
    );
    res.status(201).json(row);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteOrderHandler: ApiRequestHandler = async (req, res) => {
  try {
    const row = await deleteOrderService(
      req.body?.run_id,
      req.body?.order_number
    );
    res.status(201).json(row);
  } catch (error){
    handleControllerError(res, error);
  }
}