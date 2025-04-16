import { Request, Response } from "express";
import { productColorsService } from "../services/product_colors.service";

class ProductColorsController {
  async getProductColorsById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await productColorsService.getProductColorsById(
        Number(id)
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
  async getAllProductColors(req: Request, res: Response) {
    try {
      const result = await productColorsService.getAllProductColors();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createProductColors(req: Request, res: Response) {  
    try {
      const newProductColors = req.body;
      const result = await productColorsService.createProductColors(
        newProductColors
      );
      if (result) {
        res.status(201).json({
          message: "Product colors created successfully",
          productColor: result,
        });
      } else {
        res.status(400).json({ message: "Failed to create product colors" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateProductColors(req: Request, res: Response): Promise<void> {               
    try {
      const { id } = req.params;
      const productColorsId = await productColorsService.getProductColorsById(
        Number(id)
      );
      if (!productColorsId) {
        res.status(404).json({ message: "Product colors not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await productColorsService.updateProductColors(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({
          message: "Product colors updated successfully",
          productColor: result,
        });
      } else {
        res.status(400).json({ message: "Failed to update product colors" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteProductColors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productColorsId = await productColorsService.getProductColorsById(
        Number(id)
      );
      if (!productColorsId) {
        res.status(404).json({ message: "Product colors not found" });
        return;
      }
      const result = await productColorsService.deleteProductColors(Number(id));
      if (result) {
        res.status(200).json({ message: "Product colors deleted successfully" });
      } else {
        res.status(404).json({ message: "Product colors not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getProductColorsByProductId(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const result = await productColorsService.getProductColorsByProductId(
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
}   
export const productColorsController = new ProductColorsController();