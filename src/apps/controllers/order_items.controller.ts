import { Request, Response } from "express";
import { orderItemsService } from "../services/order_items.service";

class OrderItemsController{
       async getOrderDetailsByOrderId(req: Request, res: Response) {
        try {
            const order_id = parseInt(req.params.order_id);
            const result = await orderItemsService.getOrderDetailsByOrderId(order_id);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

}
export const orderItemsController = new OrderItemsController();