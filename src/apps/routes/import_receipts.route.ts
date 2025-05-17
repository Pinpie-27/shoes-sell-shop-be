import { Router } from "express";
import express from "express";
import { importReceiptsController } from "../controllers/import_receipts.controller";

const router = express.Router();
router.get(
  "/import_receipt/:id",
  importReceiptsController.getImportReceiptById
);
router.get("/import_receipts", importReceiptsController.getAllImportReceipts);
router.post("/import_receipt", importReceiptsController.createImportReceipt);
router.put("/import_receipt/:id", importReceiptsController.updateImportReceipt);
router.delete(
  "/import_receipt/:id",
  importReceiptsController.deleteImportReceipt
);
router.get(
  "/search/import_receipt",
  importReceiptsController.searchImportReceipts
);
export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
