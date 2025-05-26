import { Router } from "express";
import express from "express";
import { orderItemsController } from "../controllers/order_items.controller";
import { authMiddleware } from "../controllers/authMiddleware";

const router = express.Router();

router.get(
  "/order_item/",
  authMiddleware.verifyTokenBasic,
  orderItemsController.getOrderDetailsByUserId
);
router.get("/order_items/", orderItemsController.getAllOrderItems);
router.put(
  "/order_item/status/:id",
  authMiddleware.verifyTokenBasic,
  orderItemsController.updateStatus
);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
