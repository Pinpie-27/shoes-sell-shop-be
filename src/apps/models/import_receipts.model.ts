import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface ImportReceipt {
  id: number;
  receipt_number: string;
  import_date: Date;
  supplier_id: number;
  created_at: string;
  updated_at: string;
}

class ImportReceiptsModel {
  async findById(id: number): Promise<ImportReceipt> {
    const [importReceipts] = await db.query<ImportReceipt[] & RowDataPacket[]>(
      "SELECT * FROM import_receipts WHERE id = ?",
      [id]
    );
    return importReceipts[0];
  }

  async getAllImportReceipts() {
    const [importReceipts] = await db.query<ImportReceipt[] & RowDataPacket[]>(
      "SELECT * FROM import_receipts"
    );
    return importReceipts;
  }
  async createImportReceipt(
    newImportReceipt: Partial<ImportReceipt>
  ): Promise<number> {
    const { receipt_number, import_date, supplier_id } = newImportReceipt;

    const [result] = await db.query(
      `INSERT INTO import_receipts (receipt_number, import_date, supplier_id, created_at, updated_at) 
                VALUES (?, ?, ?, NOW(), NOW())`,
      [receipt_number, import_date, supplier_id]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
  }
  async updateImportReceipt(
    id: number,
    updatedFields: Partial<ImportReceipt>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE import_receipts SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  async deleteImportReceipt(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM import_receipts WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
  async findByReceiptNumber(receipt_number: string) {
    const [importReceipts] = await db.query<ImportReceipt[] & RowDataPacket[]>(
      "SELECT * FROM import_receipts WHERE receipt_number LIKE?",
      [`%${receipt_number}%`]
    );
    return importReceipts;
  }
}
export const importReceiptsModel = new ImportReceiptsModel();
