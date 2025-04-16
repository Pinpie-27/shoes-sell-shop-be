import {ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Category {
    id: number;
    name: string;
    description: string;
}

class CategoriesModel {
    async findById(id:number) : Promise<Category>{
        const [categories] = await db.query<Category[] & RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
        return categories[0] 
    }
    async getAllCategories() {
        const [categories] = await db.query<Category[] & RowDataPacket[]>('SELECT * FROM categories');
        return categories;
    }

    async createCategory(newCategory: Partial<Category>): Promise<number> {
        const { name, description } = newCategory;
    
        const [result] = await db.query(
            `INSERT INTO categories (name, description) 
             VALUES (?, ?)`,
            [name, description]
        );
    
        return (result as ResultSetHeader & { insertId: number }).insertId;
    }

    async updateCategory(id: number, updatedFields: Partial<Category>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await db.query(
            `UPDATE categories SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteCategory(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByCategoryName(name: string) {
        const [categories] = await db.query<Category[] & RowDataPacket[]>(
            'SELECT * FROM categories WHERE name LIKE?',
            [`%${name}%`]
        );
        return categories;
    }
}
export const categoriesModel = new CategoriesModel();