import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

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

class OrdersModel {
    async createOrderFromCart(user_id: number): Promise<number> {
        const [cartItems] = await db.query<Cart_Items[] & RowDataPacket[]>(
            `SELECT * FROM cart_items WHERE user_id = ?`, [user_id]
        );
    
        if (cartItems.length === 0) throw new Error("Cart is empty.");

        const total_price = cartItems.reduce((sum, item) => {
            console.log(`Item ID: ${item.id}, Price: ${item.price}`);
            return sum + Number(item.price);
        }, 0);
        
        const [orderResult] = await db.query<ResultSetHeader>(`
            INSERT INTO orders (user_id, status, total_price, created_at)
            VALUES (?, 'Pending', ?, NOW())`, [user_id, total_price]
        );
    
        const orderId = (orderResult as ResultSetHeader & { insertId: number }).insertId;
    
        // Insert order items into order_items table
        for (const item of cartItems) {
            await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }
    
        // Clear the cart after the order is created
        await db.query(`DELETE FROM cart_items WHERE user_id = ?`, [user_id]);
    
        return orderId;
    }
    
    
    async getOrdersByUserId(user_id: number): Promise<Order[]> {
        const [orders] = await db.query<Order[] & RowDataPacket[]>(
            `SELECT * FROM orders WHERE user_id = ?`, [user_id]
        );
        return orders;
    }

    async getAllOrders(){
        const [orders] = await db.query<Order[] & RowDataPacket[]>(
            `SELECT * FROM orders`
        );
        return orders;
    }
    async updateOrderStatus(id: number, status: string) : Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, id]
          );
          return result.affectedRows > 0;
    }
    async deleteOrder(id: number) : Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            `DELETE FROM orders WHERE id = ?`,
            [id]
          );
          return result.affectedRows > 0;
    }

    async getOrderById(id: number): Promise<Order | null> {
        const [order] = await db.query<Order[] & RowDataPacket[]>(
            `SELECT * FROM orders WHERE id = ?`, [id]
        );
        return order[0];
    }
}
export const ordersModel = new OrdersModel();