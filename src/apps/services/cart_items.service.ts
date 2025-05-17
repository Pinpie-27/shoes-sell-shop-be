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
}
export const cartItemsService = new CartItemsService();
