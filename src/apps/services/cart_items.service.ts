import { cartItemsModel } from "../models/cart_items.model";
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size: string;
  price: number;
  created_at: string;
}

class CartItemsService {
  async createCartItem(newCartItem: Partial<CartItem>): Promise<number> {
    return await cartItemsModel.createCartItem(newCartItem);
  }

  async getCartItemsByUserId(user_id: number): Promise<any[]> {
    return await cartItemsModel.getCartItemsByUserId(user_id);
  }

  async getAllCartItems() {
    return await cartItemsModel.getAllCartItems();
  }

  async deleteCartItem(id: number) {
    return await cartItemsModel.deleteCartItem(id);
  }

  async updateCartItem(id: number, newQuantity: number): Promise<void> {
    return await cartItemsModel.updateCartItemQuantity(id, newQuantity);
  }
}
export const cartItemsService = new CartItemsService();
