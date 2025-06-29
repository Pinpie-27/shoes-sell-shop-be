import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Inventory {
  id: number;
  product_id: number;
  size: number;
  quantity: number;
  updated_at: string;
}

class InventoryModel {
  async findById(id: number): Promise<Inventory> {
    const [inventory] = await db.query<Inventory[] & RowDataPacket[]>(
      "SELECT * FROM inventory WHERE id =?",
      [id]
    );
    return inventory[0];
  }
  async getAllInventoryGroupBy() {
    const [inventory] = await db.query<Inventory[] & RowDataPacket[]>(
      "SELECT * FROM inventory GROUP BY product_id"
    );
    return inventory;
  }

  async getAllInventory() {
    const [inventory] = await db.query<Inventory[] & RowDataPacket[]>(
      "SELECT * FROM inventory"
    );
    return inventory;
  }

  async getAvailableSizesByProductId(product_id: number): Promise<number[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT size FROM inventory WHERE product_id = ? AND quantity > 0",
      [product_id]
    );
    return rows.map((row: any) => row.size);
  }

  async getProductNameById(product_id: number): Promise<string | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT name FROM products WHERE id = ?",
      [product_id]
    );
    return rows.length > 0 ? rows[0].name : null;
  }

  async getProductIdByName(productName: string): Promise<number | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM products WHERE name = ?",
      [productName]
    );
    return rows.length > 0 ? rows[0].id : null;
  }
}
export const inventoryModel = new InventoryModel();
