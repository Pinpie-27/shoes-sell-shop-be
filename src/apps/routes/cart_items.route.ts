import { Router } from "express";
import express from "express";
import { cartItemsController } from "../controllers/cart_items.controller";
import { authMiddleware } from "../controllers/authMiddleware";

const router = express.Router();

router.post(
  "/cart_item",
  authMiddleware.verifyTokenBasic,
  cartItemsController.createCartItem
);
router.get(
  "/cart_items/",
  authMiddleware.verifyTokenBasic,
  cartItemsController.getCartItemsByUser
);
router.get("/cartItems", cartItemsController.getAllCartItems);
router.put("/cart_item/:id", cartItemsController.updateQuantity);
router.delete("/cart_item/:id", cartItemsController.deleteCartItem);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
