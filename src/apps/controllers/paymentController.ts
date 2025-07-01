import { Request, Response } from "express";
import { createPaymentUrl, verifyPayment } from "../services/paymentService";
import { ordersService } from "../services/orders.service";

export const createOrderAndPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      user_id,
      receiver_name,
      receiver_phone,
      receiver_address,
      note,
      payment_method,
      items,
    } = req.body;

    // Tạo đơn hàng + order_items + payment trong DB (payment trạng thái Pending)
    const shippingInfo = {
      receiver_name,
      receiver_phone,
      receiver_address,
      note,
    };

    const orderId = await ordersService.createOrderWithItems(
      user_id,
      shippingInfo,
      payment_method,
      items
    );

    if (payment_method === "VNPAY") {
      const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      // Lấy tổng tiền từ DB để chắc chắns
      const order = await ordersService.getOrderById(orderId);
      const paymentUrl = createPaymentUrl(
        orderId.toString(),
        order.total_price,
        ipAddr as string
      );
      console.log("PaymentUrl: ", paymentUrl);
      // Thêm return ở đây
      return void res.status(200).json({
        message: "Redirect to VNPay",
        paymentUrl,
      });
    }

    // Thêm return ở đây
    return void res.status(201).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (err: any) {
    console.error(err);
    return void res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const handleReturn = (req: Request, res: Response) => {
  console.log("VNPay callback query:", req.query);
  const isValid = verifyPayment(req.query as Record<string, any>);
  if (isValid) {
    // Bạn có thể cập nhật trạng thái đơn hàng, thanh toán tại đây nếu muốn
    res.status(200).json({ message: "Thanh toán thành công", data: req.query });
  } else {
    res.status(400).json({ message: "Sai chữ ký hoặc thanh toán thất bại" });
  }
};
