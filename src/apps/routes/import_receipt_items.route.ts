import { Router } from "express";
import express from "express";
import { importReceiptItemsController } from "../controllers/import_receipt_items.controller";

const router = express.Router();
router.get(
  "/import-receipt-item/:id",
  importReceiptItemsController.getItemById
);
router.get("/import-receipt-items", importReceiptItemsController.getAllItems);
router.post("/import-receipt-item", importReceiptItemsController.createItem);
router.put("/import-receipt-item/:id", importReceiptItemsController.updateItem);
router.delete(
  "/import-receipt-item/:id",
  importReceiptItemsController.deleteItem
);
router.get(
  "/import-receipt-items/search/:search",
  importReceiptItemsController.searchItems
);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
