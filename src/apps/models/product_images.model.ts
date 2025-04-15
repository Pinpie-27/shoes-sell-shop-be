import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Product_Images {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
}

class ProductImagesModel {
  async findById(id: number): Promise<Product_Images> {
    const [productImages] = await db.query<Product_Images[] & RowDataPacket[]>(
      "SELECT * FROM product_images WHERE id = ?",
      [id]
    );
    return productImages[0];
  }
  async getAllProductImages() {
    const [productImages] = await db.query<Product_Images[] & RowDataPacket[]>(
      "SELECT * FROM product_images"
    );
    return productImages;
  }
  async createProductImage(
    newProductImage: Partial<Product_Images>
  ): Promise<number> {
    const { product_id, image_url } = newProductImage;
    const [result] = await db.query(
      `INSERT INTO product_images (product_id, image_url)
      VALUES (?, ?)`,
      [product_id, image_url]
    );
    return (result as ResultSetHeader & { insertId: number }).insertId;
  }
  async updateProductImage(
    id: number,
    updatedFields: Partial<Product_Images>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE product_images set ${fields} WHERE id = ?`,
      [...values]
    );
    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }
  async deleteProductImages(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM product_images WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
export const productImagesModel = new ProductImagesModel();