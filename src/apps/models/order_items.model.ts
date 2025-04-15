import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

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

class OrderItemsModel {
        async getOrderDetails(order_id: number) {
        const [orderDetails] = await db.query<Order[] & RowDataPacket[]>(
            `SELECT * FROM order_items WHERE order_id = ?`, [order_id]
        );
        return orderDetails;
    }

}

export const orderItemsModel = new OrderItemsModel();