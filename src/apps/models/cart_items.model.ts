import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size: string;
  price: number;
  created_at: string;
}

class CartItemsModel {
  async createCartItem(newCartItem: Partial<CartItem>): Promise<number> {
    const { user_id, product_id, quantity, size } = newCartItem;

    if (!user_id || !product_id || !quantity || !size) {
      throw new Error("Missing required fields to add item to cart.");
    }

    const [inventoryRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM inventory WHERE product_id = ? AND size = ?`,
      [product_id, size]
    );

    if (inventoryRows.length === 0 || inventoryRows[0].quantity < quantity) {
      throw new Error("Không đủ hàng tồn kho hoặc sản phẩm không tồn tại.");
    }

    const sellingPrice = inventoryRows[0].selling_price;

    const [existingRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?`,
      [user_id, product_id, size]
    );

    if (existingRows.length > 0) {
      const existingItem = existingRows[0];

      await db.query(
        `UPDATE cart_items SET quantity = quantity + ?, price = price + ? WHERE id = ?`,
        [quantity, quantity * sellingPrice, existingItem.id]
      );

      return existingItem.id;
    } else {
      const totalPrice = quantity * sellingPrice;
      const [insertResult] = await db.query<ResultSetHeader>(
        `INSERT INTO cart_items (user_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)`,
        [user_id, product_id, quantity, totalPrice, size]
      );
      return insertResult.insertId;
    }
  }

  async getAllCartItems() {
    const [cartItems] = await db.query<CartItem[] & RowDataPacket[]>(
      "SELECT * FROM cart_items"
    );
    return cartItems;
  }

  async getCartItemsByUserId(user_id: number): Promise<any[]> {
    const [items] = await db.query<RowDataPacket[]>(
      `SELECT ci.*, p.name AS product_name
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`,
      [user_id]
    );
    return items;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM cart_items WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
  async updateCartItemQuantity(id: number, newQuantity: number): Promise<void> {
    const [cartRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM cart_items WHERE id = ?`,
      [id]
    );

    const cartItem = cartRows[0];

    const [inventoryRows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM inventory WHERE product_id = ? AND size = ?`,
      [cartItem.product_id, cartItem.size]
    );

    if (inventoryRows.length === 0 || inventoryRows[0].quantity < newQuantity) {
      throw new Error("Not enough quantity.");
    }

    const newPrice = newQuantity * inventoryRows[0].selling_price;

    await db.query(
      `UPDATE cart_items SET quantity = ?, price = ? WHERE id = ?`,
      [newQuantity, newPrice, id]
    );
  }
}

export const cartItemsModel = new CartItemsModel();
