import { Request, Response } from "express";
import { colorVariantsService } from "../services/color_variants.service";

class ColorVariantsController {
  async getColorVariantById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await colorVariantsService.getColorVariantById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Color variant not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllColorVariants(req: Request, res: Response) {
    try {
      const result = await colorVariantsService.getAllColorVariants();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createColorVariant(req: Request, res: Response) {
    try {
      const newColorVariant = req.body;
      const result = await colorVariantsService.createColorVariant(newColorVariant);
      if (result) {
        res.status(201).json({ message: "Color variant created successfully" });
      } else {
        res.status(400).json({ message: "Failed to create color variant" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateColorVariant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colorVariantId = await colorVariantsService.getColorVariantById(Number(id));
      if (!colorVariantId) {
        res.status(404).json({ message: "Color variant not found" });
      }
      const updatedFields = req.body;
      const result = await colorVariantsService.updateColorVariant(Number(id), updatedFields);
      if (result) {
        res.status(200).json({ message: "Color variant updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update color variant" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteColorVariant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colorVariantId = await colorVariantsService.getColorVariantById(Number(id));
      if (!colorVariantId) {
        res.status(404).json({ message: "Color variant not found" });
      }
      const result = await colorVariantsService.deleteColorVariant(Number(id));
      if (result) {
        res.status(200).json({ message: "Color variant deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete color variant" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchColorVariantByKeyword(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await colorVariantsService.searchColorVariants(String(keyword));
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const colorVariantsController = new ColorVariantsController();