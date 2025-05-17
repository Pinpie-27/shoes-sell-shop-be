import { importReceiptsModel } from "../models/import_receipts.model";
export interface ImportReceipt {
  id: number;
  receipt_number: string;
  import_date: Date;
  supplier_id: number;
  created_at: string;
  updated_at: string;
}

class ImportReceiptsService {
  async getImportReceiptById(id: number) {
    return await importReceiptsModel.findById(id);
  }
  async getAllImportReceipts() {
    return await importReceiptsModel.getAllImportReceipts();
  }
  async createImportReceipt(
    newImportReceipt: Partial<ImportReceipt>
  ): Promise<number> {
    return await importReceiptsModel.createImportReceipt(newImportReceipt);
  }
  async updateImportReceipt(id: number, updatedFields: Partial<ImportReceipt>) {
    return await importReceiptsModel.updateImportReceipt(id, updatedFields);
  }
  async deleteImportReceipt(id: number) {
    return await importReceiptsModel.deleteImportReceipt(id);
  }
  async searchImportReceipts(keyword: string) {
    return await importReceiptsModel.findByReceiptNumber(keyword);
  }
}
export const importReceiptsService = new ImportReceiptsService();
