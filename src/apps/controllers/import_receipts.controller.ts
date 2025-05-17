import { Request, Response } from "express";
import { importReceiptsService } from "../services/import_receipts.service";

class ImportReceiptsController {
  async getImportReceiptById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await importReceiptsService.getImportReceiptById(
        Number(id)
      );
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Import receipt not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllImportReceipts(req: Request, res: Response) {
    try {
      const result = await importReceiptsService.getAllImportReceipts();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createImportReceipt(req: Request, res: Response) {
    try {
      const newImportReceipt = req.body;
      const result = await importReceiptsService.createImportReceipt(
        newImportReceipt
      );
      if (result) {
        res.status(201).json({
          message: "Import receipt created successfully",
          import_receipt: result,
        });
      } else {
        res.status(400).json({ message: "Failed to create import receipt" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateImportReceipt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const importReceiptId = await importReceiptsService.getImportReceiptById(
        Number(id)
      );
      if (!importReceiptId) {
        res.status(404).json({ message: "Import receipt not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await importReceiptsService.updateImportReceipt(
        Number(id),
        updatedFields
      );
      if (result) {
        res
          .status(200)
          .json({ message: "Import receipt updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update import receipt" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteImportReceipt(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const importReceiptId = await importReceiptsService.getImportReceiptById(
        Number(id)
      );
      if (!importReceiptId) {
        res.status(404).json({ message: "Import receipt not found" });
        return;
      }
      const result = await importReceiptsService.deleteImportReceipt(
        Number(id)
      );
      if (result) {
        res
          .status(200)
          .json({ message: "Import receipt deleted successfully" });
      } else {
        res.status(404).json({ message: "Import receipt not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchImportReceipts(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await importReceiptsService.searchImportReceipts(
        keyword as string
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const importReceiptsController = new ImportReceiptsController();
