import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

class SuppliersModel {
  async findById(id: number): Promise<Supplier> {
    const [suppliers] = await db.query<Supplier[] & RowDataPacket[]>(
      "SELECT * FROM suppliers WHERE id = ?",
      [id]
    );
    return suppliers[0];
  }
  async getAllSuppliers() {
    const [suppliers] = await db.query<Supplier[] & RowDataPacket[]>(
      "SELECT * FROM suppliers"
    );
    return suppliers;
  }
  // async createSupplier(newSupplier: Partial<Supplier>): Promise<number> {
  //   const { name, phone, email, address } = newSupplier;

  //   const [result] = await db.query(
  //     `INSERT INTO suppliers (name, phone, email, address, created_at, updated_at)
  //               VALUES (?, ?, ?, ?, NOW(), NOW())`,
  //     [name, phone, email, address]
  //   );

  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }
  async createSupplier(newSupplier: Partial<Supplier>): Promise<number> {
    const { name, phone, email, address } = newSupplier;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM suppliers"
      );
      const nextId = countResult[0].next_id;

      await connection.query(
        `INSERT INTO suppliers (id, name, phone, email, address, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [nextId, name, phone, email, address]
      );

      await connection.query(
        `ALTER TABLE suppliers AUTO_INCREMENT = ${nextId + 1}`
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

  async updateSupplier(
    id: number,
    updatedFields: Partial<Supplier>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE suppliers SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  // async deleteSupplier(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM suppliers WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }
  async deleteSupplier(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra supplier tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM suppliers WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa supplier
      await connection.query("DELETE FROM suppliers WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các supplier có ID lớn hơn
      await connection.query("UPDATE suppliers SET id = id - 1 WHERE id > ?", [
        id,
      ]);

      // 5. Lấy số lượng supplier hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM suppliers"
      );
      const supplierCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE suppliers AUTO_INCREMENT = ${supplierCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting supplier:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findBySupplierName(name: string) {
    const [suppliers] = await db.query<Supplier[] & RowDataPacket[]>(
      "SELECT * FROM suppliers WHERE name LIKE?",
      [`%${name}%`]
    );
    return suppliers;
  }
}
export const suppliersModel = new SuppliersModel();
