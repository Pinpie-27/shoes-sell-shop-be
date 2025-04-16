import { Request, Response } from "express";
import { ordersService } from "../services/orders.service";
class OrdersController {
    async createOrder(req: Request, res: Response) {
        try {
            const { user_id } = req.body;
            const result = await ordersService.createOrderFromCart(user_id);
            if (result) {
                res.status(201).json({ message: "Order created successfully" });
            } else {
                res.status(400).json({ message: "Failed to create order" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async getOrdersByUserId(req: Request, res: Response) {
        try {
            const user_id = parseInt(req.params.user_id);
            const result = await ordersService.getOrdersByUserId(user_id);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async getAllOrders(req: Request, res: Response) {
        try {
            const result = await ordersService.getAllOrders();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            const result = await ordersService.updateOrderStatus(id, status);
            if (result) {
                res.status(200).json({ message: "Order status updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update order status" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async deleteOrder(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await ordersService.deleteOrder(id);
            if (result) {
                res.status(200).json({ message: "Order deleted successfully" });
            } else {
                res.status(400).json({ message: "Failed to delete order" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async getOrderById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await ordersService.getOrderById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const ordersController = new OrdersController();