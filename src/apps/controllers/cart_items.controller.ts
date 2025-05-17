import { Request, Response } from "express";
import { cartItemsService } from "../services/cart_items.service";

class CartItemsController {
  async createCartItem(req: Request, res: Response): Promise<void> {
    try {
      const newCartItem = req.body;
      const result = await cartItemsService.createCartItem(newCartItem);
      res.status(201).json({
        message: "Item added to cart successfully",
        cartItemId: result,
      });
    } catch (err) {
      console.error("Error in createCartItem:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getCartItemsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const result = await cartItemsService.getCartItemsByUserId(
        Number(user_id)
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const cartItemsController = new CartItemsController();
