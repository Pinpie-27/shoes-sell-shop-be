import { Request, Response } from "express";
import { inventoryService } from "../services/inventory.service";
import { ordersModel } from "../models/orders.model";

export const dialogflowWebhook = async (
  req: Request,
  res: Response
): Promise<any> => {
  const intent = req.body.queryResult.intent.displayName as string;
  const params = req.body.queryResult.parameters;

  try {
    if (intent === "KiemTraSizeConHang") {
      const productId: number = params["product_id"];
      const sizes = await inventoryService.getAvailableSizesByProductId(
        productId
      );
      const productName = await inventoryService.getProductNameById(productId);

      if (!sizes.length) {
        return res.json({
          fulfillmentText: `Sản phẩm ${
            productName || productId
          } hiện đã hết hàng.`,
        });
      }

      const sizeList = sizes.join(", ");
      return res.json({
        fulfillmentText: `Sản phẩm ${
          productName || productId
        } hiện còn các size: ${sizeList}.`,
      });
    }

    if (intent === "TraCuuDonHang") {
      const orderId: number = params["order_id"];
      const order = await ordersModel.getOrderById(orderId);

      if (!order) {
        return res.json({
          fulfillmentText: `Không tìm thấy đơn hàng mã ${orderId}.`,
        });
      }

      return res.json({
        fulfillmentText: `Đơn hàng #${
          order.id
        } có tổng tiền ${order.total_price.toLocaleString()} VNĐ, trạng thái: ${
          order.payment_status
        }, đặt ngày ${order.created_at}.`,
      });
    }

    return res.json({
      fulfillmentText: "Xin lỗi, tôi chưa xử lý được yêu cầu này.",
    });
  } catch (error) {
    return res.json({
      fulfillmentText: "Hệ thống đang gặp lỗi. Vui lòng thử lại sau.",
    });
  }
};
