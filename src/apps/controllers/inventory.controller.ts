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

  async createInventory(req: Request, res: Response) {
    try {
      const newInventory = req.body;
      const result = await inventoryService.createInventory(newInventory);
      if (result) {
        res.status(201).json({message: "Inventory   created successfully", inventory: result});
      } else {
        res.status(400).json({ message: "Failed to create inventory" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateInventory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const inventoryId = await inventoryService.getInventoryById(Number(id));
      if (!inventoryId) {
        res.status(404).json({ message: "Inventory not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await inventoryService.updateInventory(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({ message: "Inventory updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update inventory" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async deleteInventory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const inventoryId = await inventoryService.getInventoryById(Number(id));
      if (!inventoryId) {
        res.status(404).json({ message: "Inventory not found" });
        return;
      }
      const result = await inventoryService.deleteInventory(Number(id));
      if (result) {
        res.status(200).json({ message: "Inventory deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete inventory" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const inventoryController = new InventoryController();