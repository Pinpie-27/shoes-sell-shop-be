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
  // async createProductImage(
  //   newProductImage: Partial<Product_Images>
  // ): Promise<number> {
  //   const { product_id, image_url } = newProductImage;
  //   const [result] = await db.query(
  //     `INSERT INTO product_images (product_id, image_url)
  //     VALUES (?, ?)`,
  //     [product_id, image_url]
  //   );
  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }
  async createProductImage(
    newProductImage: Partial<Product_Images>
  ): Promise<number> {
    const { product_id, image_url } = newProductImage;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Sử dụng MAX(id) thay vì COUNT để tránh duplicate
      const [maxResult] = await connection.query<any[]>(
        "SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM product_images"
      );
      const nextId = maxResult[0].next_id;

      await connection.query(
        `INSERT INTO product_images (id, product_id, image_url)
       VALUES (?, ?, ?)`,
        [nextId, product_id, image_url]
      );

      await connection.query(
        `ALTER TABLE product_images AUTO_INCREMENT = ${nextId + 1}`
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
  // async deleteProductImages(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM product_images WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }
  async deleteProductImages(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra product image tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM product_images WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa product image
      await connection.query("DELETE FROM product_images WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các product image có ID lớn hơn
      await connection.query(
        "UPDATE product_images SET id = id - 1 WHERE id > ?",
        [id]
      );

      // 5. Lấy số lượng product image hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM product_images"
      );
      const productImageCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE product_images AUTO_INCREMENT = ${productImageCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting product image:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
export const productImagesModel = new ProductImagesModel();
