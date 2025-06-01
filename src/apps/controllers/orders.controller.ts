// import { Request, Response } from "express";
// import { ordersService } from "../services/orders.service";
// import { createOrderAndPayment } from "./paymentController";

// class OrdersController {
//   async createOrderWithItems(req: Request, res: Response): Promise<void> {
//     try {
//       const {
//         user_id,
//         total_price,
//         created_at,
//         receiver_name,
//         receiver_phone,
//         receiver_address,
//         note,
//         payment_method,
//         items,
//       } = req.body;

//       // Tạo object shippingInfo theo backend đang dùng
//       const shippingInfo = {
//         receiver_name,
//         receiver_phone,
//         receiver_address,
//         note,
//         total_price,
//         created_at,
//       };

//       const result = await ordersService.createOrderWithItems(
//         user_id,
//         shippingInfo,
//         payment_method,
//         items
//       );

//       res.status(201).json({
//         message: "Order created successfully",
//         orderId: result,
//       });
//     } catch (err: any) {
//       console.error(err);
//       res
//         .status(500)
//         .json({ message: "Internal Server Error", error: err.message });
//     }
//   }

//   getOrderById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const orderId = parseInt(req.params.id);

//       if (isNaN(orderId)) {
//         res.status(400).json({ message: "ID không hợp lệ" });
//         return;
//       }

//       const order = await ordersService.getOrderById(orderId);
//       res.status(200).json(order);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message || "Lỗi server" });
//     }
//   };

//   getAllOrders = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const orders = await ordersService.getAllOrders();
//       res.status(200).json(orders);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message || "Lỗi server" });
//     }
//   };
// }

// export const ordersController = new OrdersController();
import { Request, Response } from "express";
import { createOrderAndPayment } from "./paymentController";
import { ordersService } from "../services/orders.service";

class OrdersController {
  async createOrderWithItems(req: Request, res: Response): Promise<void> {
    // Gọi lại hàm đã xử lý logic cho cả COD và VNPAY
    return createOrderAndPayment(req, res);
  }

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        res.status(400).json({ message: "ID không hợp lệ" });
        return;
      }

      const order = await ordersService.getOrderById(orderId);
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Lỗi server" });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await ordersService.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Lỗi server" });
    }
  };
}

export const ordersController = new OrdersController();
