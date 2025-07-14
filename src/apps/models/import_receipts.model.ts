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
    const [importReceipts] = await db.query<RowDataPacket[]>(
      `SELECT id, receipt_number, 
            DATE_FORMAT(import_date, '%Y-%m-%d') AS import_date,
            supplier_id, created_at, updated_at 
     FROM import_receipts 
     WHERE id = ?`,
      [id]
    );
    return importReceipts[0] as ImportReceipt;
  }

  async getAllImportReceipts() {
    const [importReceipts] = await db.query<RowDataPacket[]>(
      `SELECT id, receipt_number, 
            DATE_FORMAT(import_date, '%Y-%m-%d') AS import_date,
            supplier_id, created_at, updated_at 
     FROM import_receipts`
    );
    return importReceipts as ImportReceipt[];
  }

  // async createImportReceipt(
  //   newImportReceipt: Partial<ImportReceipt>
  // ): Promise<number> {
  //   const { receipt_number, import_date, supplier_id } = newImportReceipt;

  //   const [result] = await db.query(
  //     `INSERT INTO import_receipts (receipt_number, import_date, supplier_id, created_at, updated_at)
  //               VALUES (?, ?, ?, NOW(), NOW())`,
  //     [receipt_number, import_date, supplier_id]
  //   );

  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }
  async createImportReceipt(
    newImportReceipt: Partial<ImportReceipt>
  ): Promise<number> {
    const { receipt_number, import_date, supplier_id } = newImportReceipt;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Sử dụng MAX(id) thay vì COUNT để tránh duplicate
      const [maxResult] = await connection.query<any[]>(
        "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM import_receipts"
      );
      const nextId = maxResult[0].next_id;

      await connection.query(
        `INSERT INTO import_receipts (id, receipt_number, import_date, supplier_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [nextId, receipt_number, import_date, supplier_id]
      );

      await connection.query(
        `ALTER TABLE import_receipts AUTO_INCREMENT = ${nextId + 1}`
      );

      await connection.commit();
      return nextId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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
  // async deleteImportReceipt(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM import_receipts WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }
  async deleteImportReceipt(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra import receipt tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM import_receipts WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa import receipt
      await connection.query("DELETE FROM import_receipts WHERE id = ?", [id]);

      // 3. Sắp xếp lại toàn bộ ID từ 1
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Tạo bảng tạm với ID mới theo thứ tự
      await connection.query(`
      CREATE TEMPORARY TABLE temp_import_receipts AS 
      SELECT ROW_NUMBER() OVER (ORDER BY id) as new_id, 
             receipt_number, import_date, supplier_id, created_at, updated_at
      FROM import_receipts 
      ORDER BY id
    `);

      // 5. Xóa toàn bộ dữ liệu cũ
      await connection.query("DELETE FROM import_receipts");

      // 6. Reset AUTO_INCREMENT về 1
      await connection.query("ALTER TABLE import_receipts AUTO_INCREMENT = 1");

      // 7. Chèn lại dữ liệu với ID mới
      await connection.query(`
      INSERT INTO import_receipts (receipt_number, import_date, supplier_id, created_at, updated_at)
      SELECT receipt_number, import_date, supplier_id, created_at, updated_at
      FROM temp_import_receipts
      ORDER BY new_id
    `);

      // 8. Xóa bảng tạm
      await connection.query("DROP TEMPORARY TABLE temp_import_receipts");

      // 9. Bật lại foreign key checks
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting import receipt:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByReceiptNumber(receipt_number: string) {
    const [importReceipts] = await db.query<RowDataPacket[]>(
      `SELECT id, receipt_number, 
            DATE_FORMAT(import_date, '%Y-%m-%d') AS import_date,
            supplier_id, created_at, updated_at 
     FROM import_receipts 
     WHERE receipt_number LIKE ?`,
      [`%${receipt_number}%`]
    );
    return importReceipts as ImportReceipt[];
  }
}
export const importReceiptsModel = new ImportReceiptsModel();
