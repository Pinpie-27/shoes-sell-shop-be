import { Router } from "express";
import express from "express";
import { orderItemsController } from "../controllers/order_items.controller";


const router = express.Router();

router.get("/order_item/:order_id", orderItemsController.getOrderDetailsByOrderId);
// router.get("/orders", ordersController.getAllOrders);
// router.post("/order", ordersController.createOrder);
// router.put("/order/:id", ordersController.updateOrderStatus);
// router.delete("/order/:id", ordersController.deleteOrder);
// router.get("/orders/user/:user_id", ordersController.getOrdersByUserId);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;