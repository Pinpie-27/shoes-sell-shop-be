import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Product_Colors {
    id: number;
    product_id: number;
    color_variant_id: number;
}

class ProductColorsModel  {
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
    async createProductColor(
        newProductColor: Partial<Product_Colors>
    ): Promise<number> {
        const { product_id, color_variant_id } = newProductColor;
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
    async getProductColorsByProductId(product_id: number) {
        const [productColors] = await db.query<Product_Colors[] & RowDataPacket[]>(
            "SELECT * FROM product_colors WHERE product_id = ?",
            [product_id]
        );
        return productColors;
    }       
}
export const productColorsModel = new ProductColorsModel(); 