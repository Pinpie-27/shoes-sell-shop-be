import { orderItemsModel } from "../models/order_items.model";

export interface Order {
    id: number;
    user_id: number;
    status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
    total_price: number;
    created_at: string;

}
export interface Order_Items {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    total_price: number;
    created_at: string;
}

class OrderItemsService {
     async getOrderDetailsByOrderId(order_id: number) {
        return await orderItemsModel.getOrderDetails(order_id);
    }
}
export const orderItemsService = new OrderItemsService();