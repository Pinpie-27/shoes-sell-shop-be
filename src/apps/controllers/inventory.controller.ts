import { Request, Response } from "express";
import { inventoryService } from "../services/inventory.service";

class InventoryController {
  async getInventoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await inventoryService.getInventoryById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllInventoryGroupBy(req: Request, res: Response) {
    try {
      const result = await inventoryService.getAllInventoryGroupBy();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getAllInventory(req: Request, res: Response) {
    try {
      const result = await inventoryService.getAllInventory();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAvailableSizesByProductId(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const result = await inventoryService.getAvailableSizesByProductId(
        Number(product_id)
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getProductNameById(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const result = await inventoryService.getProductNameById(
        Number(product_id)
      );
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getProductIdByName(req: Request, res: Response): Promise<any> {
    try {
      const { name } = req.query;
      if (typeof name !== "string") {
        return res.status(400).json({ message: "Invalid product name" });
      }
      const productId = await inventoryService.getProductIdByName(name);
      if (productId) {
        res.status(200).json({ product_id: productId });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const inventoryController = new InventoryController();
