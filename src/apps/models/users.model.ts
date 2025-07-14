import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  vip_level_id: number;
  created_at: string;
  role: string;
}

class UsersModel {
  async findById(id: number): Promise<User> {
    const [users] = await db.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return users[0];
  }

  async findByUserName(username: string) {
    if (!username) {
      throw new Error("Username must be provided.");
    }

    const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
    const [rows]: any = await db.execute(query, [username]);

    return rows.length > 0 ? rows[0] : null;
  }

  async getAllUsers() {
    const [users] = await db.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users"
    );
    return users;
  }

  // async createUser(newUser: Partial<User>): Promise<number> {
  //   const { username, email, password, phone, address, vip_level_id, role } =
  //     newUser;

  //   const [result] = await db.query<ResultSetHeader>(
  //     `INSERT INTO users (username, email, password, phone, address, vip_level_id, role, created_at)
  //            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
  //     [
  //       username,
  //       email,
  //       password,
  //       phone,
  //       address,
  //       vip_level_id || 5,
  //       role || "user",
  //     ]
  //   );

  //   return result.insertId;
  // }

  async createUser(newUser: Partial<User>): Promise<number> {
    const { username, email, password, phone, address, vip_level_id, role } =
      newUser;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) + 1 as next_id FROM users"
      );
      const nextId = countResult[0].next_id;

      await connection.query(
        `INSERT INTO users (id, username, email, password, phone, address, vip_level_id, role, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          nextId,
          username,
          email,
          password,
          phone,
          address,
          vip_level_id || 5,
          role || "user",
        ]
      );

      await connection.query(
        `ALTER TABLE users AUTO_INCREMENT = ${nextId + 1}`
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

  // async deleteUser(id: number): Promise<boolean> {
  //   const [result] = await db.query<ResultSetHeader>(
  //     "DELETE FROM users WHERE id = ?",
  //     [id]
  //   );
  //   return result.affectedRows > 0;
  // }

  async deleteUser(id: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Kiểm tra user tồn tại
      const [checkResult] = await connection.query<any[]>(
        "SELECT id FROM users WHERE id = ?",
        [id]
      );

      if (checkResult.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Xóa user
      await connection.query("DELETE FROM users WHERE id = ?", [id]);

      // 3. Tắt safe mode và foreign key checks
      await connection.query("SET SQL_SAFE_UPDATES = 0");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // 4. Cập nhật ID cho các user có ID lớn hơn
      await connection.query("UPDATE users SET id = id - 1 WHERE id > ?", [id]);

      // 5. Lấy số lượng user hiện tại để set AUTO_INCREMENT
      const [countResult] = await connection.query<any[]>(
        "SELECT COUNT(*) as count FROM users"
      );
      const userCount = countResult[0].count;

      // 6. Reset AUTO_INCREMENT
      await connection.query(
        `ALTER TABLE users AUTO_INCREMENT = ${userCount + 1}`
      );

      // 7. Bật lại các settings
      await connection.query("SET SQL_SAFE_UPDATES = 1");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      await connection.commit();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateUser(id: number, updatedFields: Partial<User>): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async searchByUserName(username: string) {
    const [reviews] = await db.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users WHERE username LIKE?",
      [`%${username}%`]
    );
    return reviews;
  }
  async findUserByUsername(username: string): Promise<User | null> {
    const [users] = await db.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (users.length === 0) return null;
    return users[0];
  }
}

export const usersModel = new UsersModel();
