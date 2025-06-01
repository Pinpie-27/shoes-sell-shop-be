import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface ShippingInfo {
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  note?: string;
}

class OrdersModel {
  async createOrderWithItems(
    user_id: number,
    shippingInfo: ShippingInfo,
    payment_method: "COD" | "VNPAY",
    items: { cart_item_id: number }[]
  ): Promise<number> {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      if (!items || items.length === 0) {
        throw new Error("Không có sản phẩm trong đơn hàng.");
      }

      const cartItemIds = items.map((item) => item.cart_item_id);
      const [cartItems] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM cart_items WHERE id IN (?) AND user_id = ?`,
        [cartItemIds, user_id]
      );

      if (cartItems.length === 0) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng.");
      }

      const total_price = cartItems.reduce(
        (sum, item: any) => sum + item.price * item.quantity,
        0
      );
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO orders 
    (user_id, total_price, created_at, receiver_name, receiver_phone, receiver_address, note)
   VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
        [
          user_id,
          total_price,
          shippingInfo.receiver_name,
          shippingInfo.receiver_phone,
          shippingInfo.receiver_address,
          shippingInfo.note || null,
        ]
      );

      const orderId = result.insertId;

      for (const item of cartItems) {
        const { product_id, quantity, price, size } = item;

        await connection.query(
          `INSERT INTO order_items 
            (order_id, product_id, quantity, price, status)
           VALUES (?, ?, ?, ?, 'Pending')`,
          [orderId, product_id, quantity, price]
        );

        // Kiểm tra tồn kho
        const [invRows] = await connection.query<RowDataPacket[]>(
          `SELECT quantity FROM inventory WHERE product_id = ? AND size = ?`,
          [product_id, size]
        );

        if (invRows.length === 0) {
          throw new Error(
            `Không tìm thấy sản phẩm ${product_id} size ${size} trong kho.`
          );
        }

        const currentQty = invRows[0].quantity;
        if (currentQty < quantity) {
          throw new Error(
            `Không đủ số lượng tồn kho cho sản phẩm ${product_id} size ${size}.`
          );
        }

        await connection.query(
          `UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND size = ?`,
          [quantity, product_id, size]
        );
      }

      // Thêm bản ghi thanh toán
      await connection.query(
        `INSERT INTO payments 
          (order_id, payment_method, payment_status, amount)
         VALUES (?, ?, 'PENDING', ?)`,
        [orderId, payment_method, total_price]
      );

      // Xóa các cart_items đã đặt
      await connection.query(
        `DELETE FROM cart_items WHERE id IN (?) AND user_id = ?`,
        [cartItemIds, user_id]
      );

      await connection.commit();
      connection.release();

      return orderId;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }
  async getOrderById(orderId: number): Promise<any> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
      o.id, o.user_id, o.total_price, o.created_at, 
      o.receiver_name, o.receiver_phone, o.receiver_address, o.note,
      p.payment_method, p.payment_status, p.amount
    FROM orders o
    LEFT JOIN payments p ON o.id = p.order_id
    WHERE o.id = ?`,
      [orderId]
    );

    if (rows.length === 0) {
      throw new Error("Không tìm thấy đơn hàng.");
    }

    return rows[0];
  }

  async getAllOrders() {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        o.id, o.user_id, o.total_price, o.created_at, 
        o.receiver_name, o.receiver_phone, o.receiver_address, o.note,
        p.payment_method, p.payment_status, p.amount
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id`
    );

    return rows;
  }

  async updateOrderPaymentStatus(orderId: string, status: string) {
    // Cập nhật trạng thái thanh toán trong bảng payments dựa vào order_id
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE payments SET payment_status = ? WHERE order_id = ?`,
      [status, orderId]
    );
    return result;
  }
}

export const ordersModel = new OrdersModel();
