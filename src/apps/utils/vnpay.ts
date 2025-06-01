import dotenv from "dotenv";
dotenv.config();

export const vnpConfig = {
  tmnCode: process.env.VNP_TMNCODE || "",
  hashSecret: process.env.VNPAY_HASH_SECRET || "",
  url: process.env.VNPAY_PAYMENT_URL || "",
  returnUrl: process.env.VNPAY_RETURN_URL || "",
};
