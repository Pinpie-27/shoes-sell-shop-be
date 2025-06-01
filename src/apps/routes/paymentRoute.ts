import { Router } from "express";
import express from "express";
import {
  createOrderAndPayment,
  handleReturn,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/create_payment", createOrderAndPayment);
router.get("/vnpay_return", handleReturn);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
