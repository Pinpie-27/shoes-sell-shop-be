import { Router } from "express";
import express from "express";
import { ordersController } from "../controllers/orders.controller";

const router = express.Router();
router.post("/order", ordersController.createOrderWithItems);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
