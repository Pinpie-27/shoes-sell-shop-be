import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Inventory{
  id: number;
  product_id: number;
  color_id: number;
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
  async getAllInventory() {
    const [inventory] = await db.query<Inventory[] & RowDataPacket[]>(
      "SELECT * FROM inventory"
    );
    return inventory;
  }
  async createInventory(newInventory: Partial<Inventory>): Promise<number> { 
    const { product_id, color_id, size, quantity } = newInventory;
    const [result] = await db.query(
      `INSERT INTO inventory (product_id, color_id, size, quantity)
      VALUES(?,?,?,?)`,

      [product_id, color_id, size, quantity]
    );
    return (result as ResultSetHeader & { insertId: number }).insertId;
  }
  async updateInventory(
    id: number,
    updatedFields: Partial<Inventory>
  ): Promise<boolean> { 
    const fields = Object.keys(updatedFields)
     .map((field) => `${field} =?`)
     .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE inventory SET ${fields} WHERE id =?`,
      [...values]
    );
    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  async deleteInventory(id: number): Promise<boolean> { 
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM inventory WHERE id =?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
export const inventoryModel = new InventoryModel();