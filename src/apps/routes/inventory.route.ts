import { Router } from "express";
import express from "express";
import { inventoryController } from "../controllers/inventory.controller";

const router = express.Router();

router.get("/inventory/:id", inventoryController.getInventoryById);
router.get("/inventories/group", inventoryController.getAllInventoryGroupBy);
router.get("/inventories", inventoryController.getAllInventory);
router.get(
  "/inventory/available-sizes/:product_id",
  inventoryController.getAvailableSizesByProductId
);
router.get(
  "/inventory/product-name/:product_id",
  inventoryController.getProductNameById
);

router.get("/inventory/product-id", inventoryController.getProductIdByName);
export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
