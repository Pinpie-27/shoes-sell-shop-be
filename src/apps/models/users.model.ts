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
    async findById(id:number) : Promise<User>{
        const [users] = await db.query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        return users[0] 
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
        const [users] = await db.query<User[] & RowDataPacket[]>('SELECT * FROM users');
        return users
    }
    
    async createUser(newUser: Partial<User>): Promise<number> {
        const { username, email, password, phone, address, vip_level_id, role } = newUser;
    
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (username, email, password, phone, address, vip_level_id, role, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [username, email, password, phone, address, vip_level_id || 1, role || "user"]
        );
    
        return result.insertId;
    }

    async deleteUser(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async updateUser(id: number, updatedFields: Partial<User>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE users SET ${fields} WHERE id = ?`, values
        );

        return result.affectedRows > 0;
    }

}

export const usersModel = new UsersModel()