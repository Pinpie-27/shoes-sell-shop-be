import { Request, Response } from "express";
import { suppliersService } from "../services/suppliers.service";

class SuppliersController {
  async getSupplierById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await suppliersService.getSupplierById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Supplier not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllSuppliers(req: Request, res: Response) {
    try {
      const result = await suppliersService.getAllSuppliers();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createSupplier(req: Request, res: Response) {
    try {
      const newSupplier = req.body;
      const result = await suppliersService.createSupplier(newSupplier);
      if (result) {
        res
          .status(201)
          .json({ message: "Supplier created successfully", supplier: result });
      } else {
        res.status(400).json({ message: "Failed to create supplier" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const supplierId = await suppliersService.getSupplierById(Number(id));
      if (!supplierId) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await suppliersService.updateSupplier(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({ message: "Supplier updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update supplier" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const supplierId = await suppliersService.getSupplierById(Number(id));
      if (!supplierId) {
        res.status(404).json({ message: "Supplier not found" });
        return;
      }
      const result = await suppliersService.deleteSupplier(Number(id));
      if (result) {
        res.status(200).json({ message: "Supplier deleted successfully" });
      } else {
        res.status(404).json({ message: "Supplier not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchSuppliers(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await suppliersService.searchSuppliers(keyword as string);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}
export const suppliersController = new SuppliersController();
