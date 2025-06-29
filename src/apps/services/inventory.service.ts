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
  async getAllInventoryGroupBy() {
    return await inventoryModel.getAllInventoryGroupBy();
  }
  async getAllInventory() {
    return await inventoryModel.getAllInventory();
  }

  async getAvailableSizesByProductId(product_id: number): Promise<number[]> {
    return await inventoryModel.getAvailableSizesByProductId(product_id);
  }
  async getProductNameById(product_id: number): Promise<string | null> {
    return await inventoryModel.getProductNameById(product_id);
  }

  async getProductIdByName(name: string){
    return await inventoryModel.getProductIdByName(name);
  }
}

export const inventoryService = new InventoryService();
