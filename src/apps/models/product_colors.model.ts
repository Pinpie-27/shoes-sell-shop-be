import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Product_Colors {
  id: number;
  product_id: number;
  color_variant_id: number;
}

class ProductColorsModel {
  async findById(id: number): Promise<Product_Colors> {
    const [productColors] = await db.query<Product_Colors[] & RowDataPacket[]>(
      "SELECT * FROM product_colors WHERE id = ?",
      [id]
    );
    return productColors[0];
  }
  async getAllProductColors() {
    const [productColors] = await db.query<Product_Colors[] & RowDataPacket[]>(
      "SELECT * FROM product_colors"
    );
    return productColors;
  }
  async isDuplicateProductColor(
    product_id: number,
    color_variant_id: number
  ): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id FROM product_colors WHERE product_id = ? AND color_variant_id = ?`,
      [product_id, color_variant_id]
    );
    return rows.length > 0;
  }

  async createProductColor(
    newProductColor: Partial<Product_Colors>
  ): Promise<any> {
    const { product_id, color_variant_id } = newProductColor;

    if (!product_id || !color_variant_id) return null;

    const isDuplicate = await this.isDuplicateProductColor(
      product_id,
      color_variant_id
    );
    if (isDuplicate) return null;
    const [result] = await db.query(
      `INSERT INTO product_colors (product_id, color_variant_id)
      VALUES (?, ?)`,
      [product_id, color_variant_id]
    );
    return (result as ResultSetHeader & { insertId: number }).insertId;
  }
  async updateProductColor(
    id: number,
    updatedFields: Partial<Product_Colors>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE product_colors set ${fields} WHERE id = ?`,
      [...values]
    );
    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  async deleteProductColor(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM product_colors WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
  async getProductColorsByProductId(name: string) {
    const [productColors] = await db.query<Product_Colors[] & RowDataPacket[]>(
      `
    SELECT pc.*, p.name AS product_name
    FROM product_colors pc
    JOIN products p ON pc.product_id = p.id
    WHERE p.name LIKE ?
    `,
      [`%${name}%`]
    );
    return productColors;
  }
}
export const productColorsModel = new ProductColorsModel();
