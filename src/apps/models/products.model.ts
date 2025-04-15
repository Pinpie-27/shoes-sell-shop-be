import {ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    style: string;
    size: string;
    category_id: number;
    created_at: string;
    updated_url: string;
}

class ProductsModel {

    async findById(id:number) : Promise<Product>{
        const [products] = await db.query<Product[] & RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
        return products[0] 
    }

    async getAllProducts() {
        const [products] = await db.query<Product[] & RowDataPacket[]>('SELECT * FROM products');
        return products;
    }

    async createProduct(newProduct: Partial<Product>): Promise<number> {
        const { name, description, price, stock,style, size, category_id } = newProduct;
    
        const [result] = await db.query(
            `INSERT INTO products (name, description, price, stock, style, size, category_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [name, description, price, stock, style, size, category_id]
        );
    
        return (result as ResultSetHeader & { insertId: number }).insertId;
    }

    async updateProduct(id: number, updatedFields: Partial<Product>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await db.query(
            `UPDATE products SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteProduct(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByProductName(name: string) {
        const [products] = await db.query<Product[] & RowDataPacket[]>(
            'SELECT * FROM products WHERE name LIKE?',
            [`%${name}%`]
        );
        return products;
    }
}

export const productsModel = new ProductsModel();