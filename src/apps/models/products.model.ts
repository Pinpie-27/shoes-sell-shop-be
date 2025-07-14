import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  style_id: number;
  created_at: string;
  updated_url: string;
}

class ProductsModel {
  async findById(id: number): Promise<Product> {
    const [products] = await db.query<Product[] & RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return products[0];
  }

  async getAllProducts() {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM products`);
    return rows;
  }

  // async createProduct(newProduct: Partial<Product>): Promise<number> {
  //   const { name, description, category_id, style_id } = newProduct;

  //   const [result] = await db.query(
  //     `INSERT INTO products (name, description, category_id,style_id, created_at, updated_at)
  //            VALUES (?, ?, ?, ?, NOW(), NOW())`,
  //     [name, description, category_id, style_id]
  //   );

  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }

  async createProduct(newProduct: Partial<Product>): Promise<number> {
    const { name, description, category_id, style_id } = newProduct;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Sử dụng MAX thay vì COUNT
      const [maxResult] = await connection.query<any[]>(
        "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM products"
      );
      const nextId = maxResult[0].next_id;

      await connection.query(
        `INSERT INTO products (id, name, description, category_id, style_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [nextId, name, description, category_id, style_id]
      );

      await connection.query(
        `ALTER TABLE products AUTO_INCREMENT = ${nextId + 1}`
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

  async updateProduct(
    id: number,
    updatedFields: Partial<Product>
  ): Promise<boolean> {
    const allowedFields = ["name", "description", "category_id", "style_id"];

    const filteredFields = Object.keys(updatedFields).filter((key) =>
      allowedFields.includes(key)
    );

    if (filteredFields.length === 0) return false;

    const fields = filteredFields.map((field) => `${field} = ?`).join(", ");
    const values = filteredFields.map((key) => (updatedFields as any)[key]);

    values.push(id);

    const [result] = await db.query(
      `UPDATE products SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }

  // async deleteProduct(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM products WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }

  async deleteProduct(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra product tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa product
      await connection.query("DELETE FROM products WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các product có ID lớn hơn
      await connection.query("UPDATE products SET id = id - 1 WHERE id > ?", [
        id,
      ]);

      // 5. Lấy số lượng product hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM products"
      );
      const productCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE products AUTO_INCREMENT = ${productCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByProductName(name: string) {
    const [products] = await db.query<Product[] & RowDataPacket[]>(
      "SELECT * FROM products WHERE name LIKE?",
      [`%${name}%`]
    );
    return products;
  }
}

export const productsModel = new ProductsModel();
