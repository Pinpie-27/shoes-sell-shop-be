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
  async createSupplier(newSupplier: Partial<Supplier>): Promise<number> {
    const { name, phone, email, address } = newSupplier;

    const [result] = await db.query(
      `INSERT INTO suppliers (name, phone, email, address, created_at, updated_at) 
                VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, phone, email, address]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
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
  async deleteSupplier(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM suppliers WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
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
