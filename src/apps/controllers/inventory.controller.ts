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
  async getAllInventory(req: Request, res: Response) {
    try {
      const result = await inventoryService.getAllInventory();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const inventoryController = new InventoryController();
