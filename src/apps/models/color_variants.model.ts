import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface ColorVariant {
  id: number;
  color_id: number;
  variant_name: string;
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
  async createColorVariant(newColorVariant: Partial<ColorVariant>): Promise<number> {
    const { color_id, variant_name } = newColorVariant;
    const [result] = await db.query(
      `INSERT INTO  color_variants (color_id, variant_name)
      VALUES (?, ?)`,
      [color_id, variant_name]
    );
    return (result as ResultSetHeader & { insertId: number }).insertId;
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
  async deleteColorVariant(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM color_variants WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
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