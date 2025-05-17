import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Order {
  user_id: number;
  status: string;
  total_price: number;
  created_at: string;
}

class OrdersModel {
  async createOrderWithItems(user_id: number): Promise<number> {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [cartItems] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM cart_items WHERE user_id = ?`,
        [user_id]
      );

      if (cartItems.length === 0) {
        throw new Error("Giỏ hàng trống.");
      }

      const total_price = cartItems.reduce(
        (sum, item: any) => sum + item.price * item.quantity,
        0
      );

      const [orderResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO orders (user_id, status, total_price, created_at)
         VALUES (?, 'Pending', ?, NOW())`,
        [user_id, total_price]
      );
      const orderId = orderResult.insertId;
      for (const item of cartItems) {
        const { product_id, quantity, price, size } = item;
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, product_id, quantity, price]
        );
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

      await connection.query(`DELETE FROM cart_items WHERE user_id = ?`, [
        user_id,
      ]);

      await connection.commit();
      connection.release();

      return orderId;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }
}

export const ordersModel = new OrdersModel();
