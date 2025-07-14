import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

class ReviewsModel {
  async findById(id: number): Promise<Review> {
    const [reviews] = await db.query<Review[] & RowDataPacket[]>(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );
    return reviews[0];
  }
  async getAllReviews() {
    const [reviews] = await db.query<Review[] & RowDataPacket[]>(
      "SELECT * FROM reviews"
    );
    return reviews;
  }

  // async createReview(newReview: Partial<Review>): Promise<number> {
  //   const { user_id, product_id, rating, comment } = newReview;

  //   const [result] = await db.query(
  //     `INSERT INTO reviews (user_id, product_id, rating, comment)
  //            VALUES (?, ?, ?, ?)`,
  //     [user_id, product_id, rating, comment]
  //   );

  //   return (result as ResultSetHeader & { insertId: number }).insertId;
  // }

  async createReview(newReview: Partial<Review>): Promise<number> {
    const { user_id, product_id, rating, comment } = newReview;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM reviews"
      );
      const nextId = countResult[0].next_id;

      await connection.query(
        `INSERT INTO reviews (id, user_id, product_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
        [nextId, user_id, product_id, rating, comment]
      );

      await connection.query(
        `ALTER TABLE reviews AUTO_INCREMENT = ${nextId + 1}`
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

  async updateReview(
    id: number,
    updatedFields: Partial<Review>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE reviews SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }

  // async deleteReview(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM reviews WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }

  async deleteReview(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra review tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM reviews WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa review
      await connection.query("DELETE FROM reviews WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các review có ID lớn hơn
      await connection.query("UPDATE reviews SET id = id - 1 WHERE id > ?", [
        id,
      ]);

      // 5. Lấy số lượng review hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM reviews"
      );
      const reviewCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE reviews AUTO_INCREMENT = ${reviewCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByReviewName(username: string) {
    const [reviews] = await db.query<Review[] & RowDataPacket[]>(
      `
    SELECT r.*
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE u.username LIKE ?
  `,
      [`%${username}%`]
    );

    return reviews;
  }
}
export const reviewsModel = new ReviewsModel();
