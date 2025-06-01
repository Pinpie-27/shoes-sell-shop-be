import { ordersModel, ShippingInfo } from "../models/orders.model";

class OrdersService {
  async createOrderWithItems(
    user_id: number,
    shippingInfo: ShippingInfo,
    payment_method: "COD" | "VNPAY",
    items: { cart_item_id: number }[]
  ): Promise<number> {
    return await ordersModel.createOrderWithItems(
      user_id,
      shippingInfo,
      payment_method,
      items
    );
  }

  async getOrderById(orderId: number) {
    return await ordersModel.getOrderById(orderId);
  }

  async getAllOrders() {
    return await ordersModel.getAllOrders();
  }

  async updateOrderPaymentStatus(orderId: string, status: string) {
    // Giả sử ordersModel có hàm updateOrderPaymentStatus, bạn cần cài đặt ở model nếu chưa có
    return await ordersModel.updateOrderPaymentStatus(orderId, status);
  }
}

export const ordersService = new OrdersService();
