import { ordersModel } from "../models/orders.model";

export interface Order {
    id: number;
    user_id: number;
    status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
    total_price: number;
    created_at: string;
  }
  
  export interface Cart_Items {
      id: number;
      user_id: number;
      product_id: number;
      quantity: number;
      price: number;
      created_at: string;
  }

  class OrdersService{
    async createOrderFromCart(user_id: number): Promise<number> {
        return await ordersModel.createOrderFromCart(user_id);
    }
    async getOrdersByUserId(user_id: number): Promise<Order[]> {
        return await ordersModel.getOrdersByUserId(user_id);
    }
    async getAllOrders() {
        return await ordersModel.getAllOrders();
    }
    async updateOrderStatus(id: number, status: string) {
        return await ordersModel.updateOrderStatus(id, status);
    }
    async deleteOrder(id: number) {
        return await ordersModel.deleteOrder(id);
    }
    async getOrderById(id: number) {
        return await ordersModel.getOrderById(id);
    }
  }
  export const ordersService = new OrdersService();