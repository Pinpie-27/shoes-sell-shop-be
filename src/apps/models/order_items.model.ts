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
  created_at: string;
}

class OrderItemsModel {
  async getOrderDetailsByUserId(user_id: number) {
    const [orderDetails] = await db.query<RowDataPacket[]>(
      `
    SELECT oi.* 
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.user_id = ?
    `,
      [user_id]
    );
    return orderDetails;
  }

  async getAllOrderItems() {
    const [orderItems] = await db.query<Order_Items[] & RowDataPacket[]>(
      "SELECT * FROM order_items"
    );
    return orderItems;
  }

  async updateStatus(
    id: number,
    status: "pending" | "shipped" | "delivered" | "cancelled"
  ) {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE order_items SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result;
  }
}

export const orderItemsModel = new OrderItemsModel();
