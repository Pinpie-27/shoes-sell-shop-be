import { Request, Response } from "express";
import { ordersService } from "../services/orders.service";

class OrdersController {
  async createOrderWithItems(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.body;
      const result = await ordersService.createOrderWithItems(user_id);
      res.status(201).json({
        message: "Order created successfully",
        orderId: result,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const ordersController = new OrdersController();
