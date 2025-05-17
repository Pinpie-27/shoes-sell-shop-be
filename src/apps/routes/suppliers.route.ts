import { Router } from "express";
import express from "express";
import { suppliersController } from "../controllers/suppliers.controller";

const router = express.Router();
router.get("/supplier/:id", suppliersController.getSupplierById);
router.get("/suppliers", suppliersController.getAllSuppliers);
router.post("/supplier", suppliersController.createSupplier);
router.put("/supplier/:id", suppliersController.updateSupplier);
router.delete("/supplier/:id", suppliersController.deleteSupplier);
router.get("/search/supplier", suppliersController.searchSuppliers);
export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
