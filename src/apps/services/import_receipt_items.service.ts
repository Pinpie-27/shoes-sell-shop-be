import { importReceiptItemsModel } from "../models/import_receipt_items.model";

export interface ImportReceiptItem {
  id: number;
  import_receipt_id: number;
  product_id: number;
  size: string;
  quantity: number;
  price_import: number;
  created_at: string;
}

class ImportReceiptItemsService {
  async getItemById(id: number) {
    return await importReceiptItemsModel.findById(id);
  }

  async getAllItems() {
    return await importReceiptItemsModel.getAllItems();
  }

  async createItem(newItem: Partial<ImportReceiptItem>): Promise<number> {
    return await importReceiptItemsModel.createItem(newItem);
  }

  async updateItem(id: number, updatedFields: Partial<ImportReceiptItem>) {
    return await importReceiptItemsModel.updateItem(id, updatedFields);
  }

  async deleteItem(id: number) {
    return await importReceiptItemsModel.deleteItem(id);
  }
  async getItemsByReceiptId(receiptId: number) {
    return await importReceiptItemsModel.findByImportReceiptId(receiptId);
  }
  async getItemsByProductId(productId: number) {
    return await importReceiptItemsModel.findByProductId(productId);
  }
}
export const importReceiptItemsService = new ImportReceiptItemsService();
