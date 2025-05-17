import { inventoryModel } from "../models/inventory.model";

export interface Inventory {
  id: number;
  product_id: number;
  color_id: number;
  size: number;
  quantity: number;
  updated_at: string;
}

class InventoryService {
  async getInventoryById(id: number) {
    return await inventoryModel.findById(id);
  }
  async getAllInventory() {
    return await inventoryModel.getAllInventory();
  }
}

export const inventoryService = new InventoryService();
