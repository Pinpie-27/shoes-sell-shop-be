import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface Cart_Items {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: string;
}

class CartItemsModel {
    async createCartItem(newCartItem: Partial<Cart_Items>): Promise<number> {
        try {
            const { user_id, product_id, quantity = 0 } = newCartItem;

            const [productRows] = await db.query<RowDataPacket[]>(
                `SELECT price, stock FROM products WHERE id = ?`,
                [product_id]
            );
    
            if (productRows.length === 0) {
                throw new Error(`Product with ID ${product_id} not found.`);
            }
    
            const pricePerUnit = productRows[0].price;
            const currentStock = productRows[0].stock;
    
            if (currentStock === 0) {
                throw new Error(`Product is out of stock.`);
            }
    
            const [existingCart] = await db.query<RowDataPacket[]>(
                `SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?`,
                [user_id, product_id]
            );
    
            if (existingCart.length > 0) {
                const existingQuantity = existingCart[0].quantity;
                const newQuantity = existingQuantity + quantity;
    
                if (newQuantity > currentStock) {
                    throw new Error(`Not enough stock to add ${quantity}. Only ${currentStock - existingQuantity} left.`);
                }
    
                const newTotalPrice = pricePerUnit * newQuantity;
    
                await db.query(
                    `UPDATE cart_items SET quantity = ?, price = ? WHERE user_id = ? AND product_id = ?`,
                    [newQuantity, newTotalPrice, user_id, product_id]
                );
    
                await db.query(
                    `UPDATE products SET stock = stock - ? WHERE id = ?`,
                    [quantity, product_id]
                );
    
                return existingCart[0].id;
            } else {
                if (quantity > currentStock) {
                    throw new Error(`Not enough stock. Only ${currentStock} left.`);
                }
    
                const totalPrice = pricePerUnit * quantity;
    
                const [result] = await db.query<ResultSetHeader>(
                    `INSERT INTO cart_items (user_id, product_id, quantity, price, created_at) 
                     VALUES (?, ?, ?, ?, NOW())`,
                    [user_id, product_id, quantity, totalPrice]
                );
    
                await db.query(
                    `UPDATE products SET stock = stock - ? WHERE id = ?`,
                    [quantity, product_id]
                );
    
                return result.insertId;
            }
        } catch (error) {
            console.error("Error creating cart item:", error);
            throw error;
        }
    }
    
    
    // update cart item
    async updateCartItem(
        id: number,
        newQuantity: number
    ): Promise<boolean> {
        try {
            if (newQuantity <= 0) {
                const [deleteResult] = await db.query<ResultSetHeader>(
                    `DELETE FROM cart_items WHERE id = ?`,
                    [id]
                );
                return deleteResult.affectedRows > 0;
            }
    
            const [cartRows] = await db.query<RowDataPacket[]>(
                `SELECT product_id FROM cart_items WHERE id = ?`,
                [id]
            );
    
            if (cartRows.length === 0) {
                throw new Error(`Cart item with ID ${id} not found.`);
            }
    
            const productId = cartRows[0].product_id;
    
            const [productRows] = await db.query<RowDataPacket[]>(
                `SELECT price FROM products WHERE id = ?`,
                [productId]
            );
    
            if (productRows.length === 0) {
                throw new Error(`Product with ID ${productId} not found.`);
            }
    
            const pricePerUnit = productRows[0].price;
            const newTotalPrice = pricePerUnit * newQuantity;
    
            const [updateResult] = await db.query<ResultSetHeader>(
                `UPDATE cart_items SET quantity = ?, price = ? WHERE id = ?`,
                [newQuantity, newTotalPrice, id]
            );
    
            return updateResult.affectedRows > 0;
        } catch (error) {
            console.error("Error updating cart item:", error);
            return false;
        }
    }
    

    async deleteCartItem(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM cart_items WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
    
    async getCartItemById(id: number): Promise<Cart_Items>{
        const [cartItems] = await db.query<Cart_Items[] & RowDataPacket[]>(
            "SELECT * FROM cart_items WHERE id = ?",
            [id]
        );
        return cartItems[0];
    }
    async getAllCartItems(){
        const [cartItems] = await db.query<Cart_Items[] & RowDataPacket[]>(
            "SELECT * FROM cart_items"
        );
        return cartItems;
    }
    async getCartItemsByUserId(user_id: number) {
        const [cartItems] = await db.query<Cart_Items[] & RowDataPacket[]>(
            "SELECT * FROM cart_items WHERE user_id = ?",
            [user_id]
        );
        return cartItems;
    }
    
}

export const cartItemsModel = new CartItemsModel();
