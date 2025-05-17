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
  async getAllInventory() {
    const [inventory] = await db.query<Inventory[] & RowDataPacket[]>(
      "SELECT * FROM inventory"
    );
    return inventory;
  }
}
export const inventoryModel = new InventoryModel();
