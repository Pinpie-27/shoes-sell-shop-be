import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Color {
  id: number;
  name: string;
}

class ColorsModel {
  async findById(id: number): Promise<Color> {
    const [colors] = await db.query<Color[] & RowDataPacket[]>(
      "SELECT * FROM colors WHERE id = ?",
      [id]
    );
    return colors[0];
  }
  async getAllColors() {
    const [colors] = await db.query<Color[] & RowDataPacket[]>(
      "SELECT * FROM colors"
    );
    return colors;
  }
  async createColor(newColor: Partial<Color>): Promise<number> {
    const { name } = newColor;
    const [result] = await db.query(
      `INSERT INTO  colors (name)
      VALUES (?)`,
      [name]
    );
    return (result as ResultSetHeader & { insertId: number }).insertId;
  }
  async updateColor(
    id: number,
    updatedFields: Partial<Color>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field}=?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE colors SET ${fields} WHERE id = ?`,
      [...values]
    );
    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  async deleteColor(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM colors WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
  async findByColorName(name: string) {
    const [colors] = await db.query<Color[] & RowDataPacket[]>(
      "SELECT * FROM colors WHERE name LIKE?",
      [`%${name}%`]
    );
    return colors;
  }
}

export const colorsModel = new ColorsModel();