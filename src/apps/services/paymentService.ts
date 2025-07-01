import qs from "qs";
import crypto from "crypto";
import moment from "moment";
import { vnpConfig } from "../utils/vnpay";
import { dateFormat } from "vnpay";

// Sắp xếp object theo key alphabet
function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// Tạo URL thanh toán VNPay với tham số động
export function createPaymentUrl(
  orderId: string,
  amount: number,
  ipAddr: string,
  orderInfo = `${orderId}`,
  bankCode = "NCB"
): string {
  const createDate = moment().format("YYYYMMDDHHmmss");
  const expireDate = moment().add(15, "minutes").format("YYYYMMDDHHmmss");

  let vnp_Params: Record<string, string> = {
    vnp_Amount: (amount * 100).toString(),
    vnp_BankCode: bankCode,
    vnp_Command: "pay",
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_ExpireDate: expireDate,
    vnp_IpAddr: "0:0:0:0:0:0:0:1",
    vnp_Locale: "vn",
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: vnpConfig.returnUrl,
    vnp_TmnCode: vnpConfig.tmnCode,
    vnp_TxnRef: orderId,
    vnp_Version: "2.1.0",
  };

  if (bankCode) {
  }

  vnp_Params = sortObject(vnp_Params);
  let signData = qs.stringify(vnp_Params, { encode: true });
  console.log("SIGN DATA ON VERIFY:", signData);

  let hmac = crypto.createHmac("sha512", vnpConfig.hashSecret);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params.vnp_SecureHash = signed;

  return `${vnpConfig.url}?${qs.stringify(vnp_Params, { encode: true })}`;
}
// Xác thực chữ ký VNPay
export function verifyPayment(query: Record<string, any>): boolean {
  const vnp_HashSecret = vnpConfig.hashSecret;

  // Lấy tất cả key bắt đầu bằng vnp_, trừ vnp_SecureHash và vnp_SecureHashType
  const vnpParams: Record<string, string> = {};
  for (const key in query) {
    if (
      key.startsWith("vnp_") &&
      key !== "vnp_SecureHash" &&
      key !== "vnp_SecureHashType"
    ) {
      vnpParams[key] = query[key];
    }
  }

  // Sắp xếp key theo alphabet
  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  // Hash SHA512
  const secureHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(signData)
    .digest("hex");

  return (
    secureHash.toUpperCase() === (query.vnp_SecureHash || "").toUpperCase()
  );
}
