import { Request, Response } from "express";
import { cartItemsService } from "../services/cart_items.service";
class CartItemsController {
    async createCartItem(req: Request, res: Response) {
        try {
            const newCartItem = req.body;
            const result = await cartItemsService.createCartItem(newCartItem);
            if (result) {
                res.status(201).json({ message: "Cart item created successfully" });
            } else {
                res.status(400).json({ message: "Failed to create cart item" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async updateCartItem(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const newQuantity = req.body.quantity;
            const cartItemId = await cartItemsService.getCartItemById(id);
            if (!cartItemId) { 
                res.status(404).json({ message: "Cart item not found" });
            }
            const result = await cartItemsService.updateCartItem(id, newQuantity);
            if (result) {
                res.status(200).json({ message: "Cart item updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update cart item" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async deleteCartItem(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const cartItemId = await cartItemsService.getCartItemById(id);
            if (!cartItemId) { 
                res.status(404).json({ message: "Cart item not found" });
            }
            const result = await cartItemsService.deleteCartItem(id);
            if (result) {
                res.status(200).json({ message: "Cart item deleted successfully" });
            } else {
                res.status(400).json({ message: "Failed to delete cart item" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async getCartItemsByUserId(req: Request, res: Response) {
        try {
            const user_id = parseInt(req.params.user_id);
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
    async getCartItemById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await cartItemsService.getCartItemById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Cart item not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const cartItemsController = new CartItemsController();