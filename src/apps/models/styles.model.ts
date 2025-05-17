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
  async createStyle(newStyle: Partial<Style>): Promise<number> {
    const { name, description } = newStyle;

    const [result] = await db.query(
      `INSERT INTO styles (name, description, created_at, updated_at) 
             VALUES (?, ?, NOW(), NOW())`,
      [name, description]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
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
  async deleteStyle(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM styles WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
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
