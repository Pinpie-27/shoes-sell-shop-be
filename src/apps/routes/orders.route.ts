import { Router } from "express";
import express from "express";
import { ordersController } from "../controllers/orders.controller";

const router = express.Router();
router.post("/order", ordersController.createOrderWithItems);
router.get("/orders/:id", ordersController.getOrderById);
router.get("/orders", ordersController.getAllOrders);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
