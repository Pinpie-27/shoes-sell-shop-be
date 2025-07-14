import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface ColorVariant {
  id: number;
  color_id: number;
  variant_name: string;
  color_code: string;
}

class ColorVariantModel {
  async findById(id: number): Promise<ColorVariant> {
    const [colorVariants] = await db.query<ColorVariant[] & RowDataPacket[]>(
      "SELECT * FROM color_variants WHERE id = ?",
      [id]
    );
    return colorVariants[0];
  }
  async getAllColorVariants() {
    const [colorVariants] = await db.query<ColorVariant[] & RowDataPacket[]>(
      "SELECT * FROM color_variants"
    );
    return colorVariants;
  }
  // async createColorVariant(
  //   newColorVariant: Partial<ColorVariant>
  // ): Promise<number> {
  //   const { color_id, variant_name, color_code } = newColorVariant;
  //   const [result] = await db.query(
  //     `INSERT INTO  color_variants (color_id, variant_name, color_code)
  //     VALUES (?, ?, ?)`,
  //     [color_id, variant_name, color_code]
  //   );
  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }
  async createColorVariant(
    newColorVariant: Partial<ColorVariant>
  ): Promise<number> {
    const { color_id, variant_name, color_code } = newColorVariant;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM color_variants"
      );
      const nextId = countResult[0].next_id;

      await connection.query(
        `INSERT INTO color_variants (id, color_id, variant_name, color_code)
       VALUES (?, ?, ?, ?)`,
        [nextId, color_id, variant_name, color_code]
      );

      await connection.query(
        `ALTER TABLE color_variants AUTO_INCREMENT = ${nextId + 1}`
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

  async updateColorVariant(
    id: number,
    updatedFields: Partial<ColorVariant>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field}=?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE color_variants SET ${fields} WHERE id = ?`,
      [...values]
    );
    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  // async deleteColorVariant(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM color_variants WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }
  async deleteColorVariant(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra color variant tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM color_variants WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa color variant
      await connection.query("DELETE FROM color_variants WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các color variant có ID lớn hơn
      await connection.query(
        "UPDATE color_variants SET id = id - 1 WHERE id > ?",
        [id]
      );

      // 5. Lấy số lượng color variant hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM color_variants"
      );
      const colorVariantCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE color_variants AUTO_INCREMENT = ${colorVariantCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting color variant:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByColorVariantName(name: string) {
    const [colorVariants] = await db.query<ColorVariant[] & RowDataPacket[]>(
      "SELECT * FROM color_variants WHERE variant_name LIKE?",
      [`%${name}%`]
    );
    return colorVariants;
  }
}

export const colorVariantModel = new ColorVariantModel();
