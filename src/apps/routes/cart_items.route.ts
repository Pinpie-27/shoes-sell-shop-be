import { Router } from "express";
import express from "express";
import { cartItemsController } from "../controllers/cart_items.controller";

const router = express.Router();

router.get("/cart_item/:id", cartItemsController.getCartItemById);
router.get("/cart_items", cartItemsController.getAllCartItems);
router.post("/cart_item", cartItemsController.createCartItem);
router.put("/cart_item/:id", cartItemsController.updateCartItem);
router.delete("/cart_item/:id", cartItemsController.deleteCartItem);
router.get("/cart_item/user/:user_id", cartItemsController.getCartItemsByUserId);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;