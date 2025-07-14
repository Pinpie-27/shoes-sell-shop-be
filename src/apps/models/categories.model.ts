import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Category {
  id: number;
  name: string;
  description: string;
}

class CategoriesModel {
  async findById(id: number): Promise<Category> {
    const [categories] = await db.query<Category[] & RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );
    return categories[0];
  }
  async getAllCategories() {
    const [categories] = await db.query<Category[] & RowDataPacket[]>(
      "SELECT * FROM categories"
    );
    return categories;
  }

  // async createCategory(newCategory: Partial<Category>): Promise<number> {
  //     const { name, description } = newCategory;

  //     const [result] = await db.query(
  //         `INSERT INTO categories (name, description)
  //          VALUES (?, ?)`,
  //         [name, description]
  //     );

  //     return (result as ResultSetHeader & { insertId: number }).insertId;
  // }

  async createCategory(newCategory: Partial<Category>): Promise<number> {
    const { name, description } = newCategory;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM categories"
      );
      const nextId = countResult[0].next_id;
      await connection.query(
        `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
        [nextId, name, description]
      );
      await connection.query(
        `ALTER TABLE categories AUTO_INCREMENT = ${nextId + 1}`
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

  async updateCategory(
    id: number,
    updatedFields: Partial<Category>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE categories SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }

  //   async deleteCategory(id: number): Promise<boolean> {
  //     const [result] = await db.query<ResultSetHeader>(
  //       "DELETE FROM categories WHERE id = ?",
  //       [id]
  //     );
  //     return result.affectedRows > 0;
  //   }

  async deleteCategory(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra category tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM categories WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa category
      await connection.query("DELETE FROM categories WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các category có ID lớn hơn
      await connection.query("UPDATE categories SET id = id - 1 WHERE id > ?", [
        id,
      ]);

      // 5. Lấy số lượng category hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM categories"
      );
      const categoryCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE categories AUTO_INCREMENT = ${categoryCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByCategoryName(name: string) {
    const [categories] = await db.query<Category[] & RowDataPacket[]>(
      "SELECT * FROM categories WHERE name LIKE?",
      [`%${name}%`]
    );
    return categories;
  }
}
export const categoriesModel = new CategoriesModel();
