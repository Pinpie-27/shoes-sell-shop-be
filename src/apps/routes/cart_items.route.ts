import { Router } from "express";
import express from "express";
import { cartItemsController } from "../controllers/cart_items.controller";

const router = express.Router();

router.post("/cart_item", cartItemsController.createCartItem);
router.get("/cart_item/:user_id", cartItemsController.getCartItemsByUserId);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
