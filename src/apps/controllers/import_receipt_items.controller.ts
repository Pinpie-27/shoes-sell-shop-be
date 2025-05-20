import { Request, Response } from "express";
import { importReceiptItemsService } from "../services/import_receipt_items.service";

class ImportReceiptItemsController {
  async getItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await importReceiptItemsService.getItemById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async getAllItems(req: Request, res: Response) {
    try {
      const result = await importReceiptItemsService.getAllItems();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createItem(req: Request, res: Response) {
    try {
      const newItem = req.body;
      const result = await importReceiptItemsService.createItem(newItem);
      if (result) {
        res
          .status(201)
          .json({ message: "Item created successfully", item: result });
      } else {
        res.status(400).json({ message: "Failed to create item" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const itemId = await importReceiptItemsService.getItemById(Number(id));
      if (!itemId) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await importReceiptItemsService.updateItem(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({ message: "Item updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update item" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const itemId = await importReceiptItemsService.getItemById(Number(id));
      if (!itemId) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      const result = await importReceiptItemsService.deleteItem(Number(id));
      if (result) {
        res.status(200).json({ message: "Item deleted successfully" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchItems(req: Request, res: Response): Promise<void> {
    try {
      const search = Number(req.params.search);
      if (isNaN(search)) {
        res.status(400).json({ message: "Invalid search parameter" });
      }

      const result =
        await importReceiptItemsService.searchItemsByReceiptOrProduct(search);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const importReceiptItemsController = new ImportReceiptItemsController();
