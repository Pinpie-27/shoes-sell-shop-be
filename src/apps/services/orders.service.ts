import { ordersModel } from "../models/orders.model";

export interface Order {
  user_id: number;
  status: string;
  total_price: number;
  created_at: string;
}

class OrdersService {
  async createOrderWithItems(user_id: number): Promise<number> {
    return await ordersModel.createOrderWithItems(user_id);
  }
}

export const ordersService = new OrdersService();
