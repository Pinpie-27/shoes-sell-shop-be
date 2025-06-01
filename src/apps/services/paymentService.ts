import qs from "qs";
import crypto from "crypto";
import { vnpConfig } from "../utils/vnpay";
import moment from "moment";

function sortObject(obj: any): Record<string, any> {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export const createPaymentUrl = (
  orderId: string,
  amount: number,
  ipAddr: string,
  orderInfo = "Thanh toan VNPay",
  bankCode = "",
  locale = "vn"
): string => {
  const createDate = moment().format("YYYYMMDDHHmmss");

  let vnp_Params: Record<string, any> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpConfig.tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // VND * 100
    vnp_ReturnUrl: vnpConfig.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpConfig.hashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params.vnp_SecureHash = signed;

  return `${vnpConfig.url}?${qs.stringify(vnp_Params, { encode: false })}`;
};

export function verifyPayment(query: Record<string, any>): boolean {
  const vnp_HashSecret = process.env.VNPAY_HASH_SECRET || "";
  console.log(process.env.VNPAY_HASH_SECRET);

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

  console.log("signData:", signData);
  console.log("secureHash:", secureHash);
  console.log("vnp_SecureHash:", query.vnp_SecureHash);
  return (
    secureHash.toUpperCase() === (query.vnp_SecureHash || "").toUpperCase()
  );
}
