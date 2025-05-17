import { Router } from "express";
import express from "express";
import { orderItemsController } from "../controllers/order_items.controller";

const router = express.Router();

router.get(
  "/order_item/:order_id",
  orderItemsController.getOrderDetailsByOrderId
);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
