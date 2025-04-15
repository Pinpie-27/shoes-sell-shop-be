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
  async createInventory(newInventory: Partial<Inventory>): Promise<number> {
    return await inventoryModel.createInventory(newInventory);
  }
  async updateInventory(
    id: number,
    updatedFields: Partial<Inventory>
  ): Promise<boolean> { 
    return await inventoryModel.updateInventory(id, updatedFields);
  }
  async deleteInventory(id: number): Promise<boolean> {
    return await inventoryModel.deleteInventory(id);
  }
}

export const inventoryService = new InventoryService()