import { Request, Response } from "express";
import { orderItemsService } from "../services/order_items.service";

class OrderItemsController {
  async getOrderDetailsByUserId(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        res.status(401).json({ message: "Unauthorized: No user info" });
        return;
      }
      const result = await orderItemsService.getOrderDetailsByUserId(user_id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllOrderItems(req: Request, res: Response) {
    try {
      const result = await orderItemsService.getAllOrderItems();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const id = req.params.id;

      if (!id || !status) {
        res.status(400).json({ message: "Bad Request: Missing parameters" });
        return;
      }

      const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(status.toLowerCase())) {
        res.status(400).json({ message: "Bad Request: Invalid status" });
        return;
      }

      const result = await orderItemsService.updateStatus(Number(id), status);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async findById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ message: "Bad Request: Missing ID" });
        return;
      }

      const result = await orderItemsService.findById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const orderItemsController = new OrderItemsController();
