import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Style {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
class StylesModel {
  async findById(id: number): Promise<Style> {
    const [styles] = await db.query<Style[] & RowDataPacket[]>(
      "SELECT * FROM styles WHERE id = ?",
      [id]
    );
    return styles[0];
  }
  async getAllStyles() {
    const [styles] = await db.query<Style[] & RowDataPacket[]>(
      "SELECT * FROM styles"
    );
    return styles;
  }
  // async createStyle(newStyle: Partial<Style>): Promise<number> {
  //   const { name, description } = newStyle;

  //   const [result] = await db.query(
  //     `INSERT INTO styles (name, description, created_at, updated_at)
  //            VALUES (?, ?, NOW(), NOW())`,
  //     [name, description]
  //   );

  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }
  async createStyle(newStyle: Partial<Style>): Promise<number> {
    const { name, description } = newStyle;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM styles"
      );
      const nextId = countResult[0].next_id;

      await connection.query(
        `INSERT INTO styles (id, name, description, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
        [nextId, name, description]
      );

      await connection.query(
        `ALTER TABLE styles AUTO_INCREMENT = ${nextId + 1}`
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

  async updateStyle(
    id: number,
    updatedFields: Partial<Style>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE styles SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  // async deleteStyle(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM styles WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }
  async deleteStyle(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra style tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM styles WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa style
      await connection.query("DELETE FROM styles WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các style có ID lớn hơn
      await connection.query("UPDATE styles SET id = id - 1 WHERE id > ?", [
        id,
      ]);

      // 5. Lấy số lượng style hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM styles"
      );
      const styleCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE styles AUTO_INCREMENT = ${styleCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting style:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByStyleName(name: string) {
    const [styles] = await db.query<Style[] & RowDataPacket[]>(
      "SELECT * FROM styles WHERE name LIKE?",
      [`%${name}%`]
    );
    return styles;
  }
}
export const stylesModel = new StylesModel();
