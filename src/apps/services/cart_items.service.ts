import { cartItemsModel } from "../models/cart_items.model";

export interface Cart_Items {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: string;
}

class CartItemsService {
    async createCartItem(newCartItem: Partial<Cart_Items>): Promise<number> {
        return await cartItemsModel.createCartItem(newCartItem);
    }
    async updateCartItem(id: number,  newQuantity: number) {
        return await cartItemsModel.updateCartItem(id, newQuantity);
    }
    async deleteCartItem(id: number) {
        return await cartItemsModel.deleteCartItem(id);
    }
    async getCartItemById(id: number) {
        return await cartItemsModel.getCartItemById(id);
    }
    async getAllCartItems() {
        return await cartItemsModel.getAllCartItems();
    }
    async getCartItemsByUserId(user_id: number) {
        return await cartItemsModel.getCartItemsByUserId(user_id);
    }
}
export const cartItemsService = new CartItemsService();