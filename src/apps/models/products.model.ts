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
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
      p.*, 
      pc.id AS product_color_id,
      pc.color_variant_id,
      cv.variant_name
    FROM products p
    LEFT JOIN product_colors pc ON p.id = pc.product_id
    LEFT JOIN color_variants cv ON pc.color_variant_id = cv.id`
    );

    const productsMap: Record<number, any> = {};

    for (const row of rows) {
      const productId = row.id;

      if (!productsMap[productId]) {
        productsMap[productId] = {
          ...row,
          colors: [],
        };
      }

      if (row.variant_name) {
        productsMap[productId].colors.push(row.variant_name);
      }
    }

    return Object.values(productsMap);
  }

  async createProduct(newProduct: Partial<Product>): Promise<number> {
    const { name, description, category_id, style_id } = newProduct;

    const [result] = await db.query(
      `INSERT INTO products (name, description, category_id,style_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, description, category_id, style_id]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
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

  async deleteProduct(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
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
