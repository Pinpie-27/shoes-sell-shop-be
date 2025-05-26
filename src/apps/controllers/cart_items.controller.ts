import { Request, Response } from "express";
import { cartItemsService } from "../services/cart_items.service";

class CartItemsController {
  async createCartItem(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        res.status(401).json({ message: "Unauthorized: No user info" });
        return;
      }

      const { product_id, quantity, size, price } = req.body;

      const result = await cartItemsService.createCartItem({
        user_id,
        product_id,
        quantity,
        size,
        price,
      });

      if (result) {
        res.status(201).json({
          message: "Item added to cart successfully",
          cartItemId: result,
        });
      } else {
        res.status(400).json({ message: "Failed to add item to cart" });
      }
    } catch (err) {
      console.error("Error in createCartItem:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getCartItemsByUser(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        res.status(401).json({ message: "Unauthorized: No user info" });
        return;
      }

      const result = await cartItemsService.getCartItemsByUserId(user_id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getAllCartItems(req: Request, res: Response) {
    try {
      const result = await cartItemsService.getAllCartItems();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async deleteCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await cartItemsService.deleteCartItem(Number(id));
      if (result) {
        res.status(200).json({ message: "CartItem deleted successfully" });
      } else {
        res.status(404).json({ message: "CartItem not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async updateQuantity(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { quantity } = req.body;

      if (!id || typeof quantity !== "number" || quantity < 1) {
        res.status(400).json({ message: "Invalid input data" });
      }

      await cartItemsService.updateCartItem(id, quantity);

      res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}
export const cartItemsController = new CartItemsController();
