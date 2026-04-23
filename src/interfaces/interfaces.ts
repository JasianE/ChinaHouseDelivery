import { OrderStatus } from '../services/serviceUtils.js';

export interface DeliveryOrderRow {
  address_value: string;
  created_at: string;
  id: number;
  order_number: string;
  run_id: number;
  status: OrderStatus;
  updated_at: string;
}