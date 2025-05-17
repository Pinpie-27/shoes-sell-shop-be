import { Router } from "express";
import express from "express";
import { inventoryController } from "../controllers/inventory.controller";

const router = express.Router();

router.get("/inventory/:id", inventoryController.getInventoryById);
router.get("/inventories", inventoryController.getAllInventory);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;
