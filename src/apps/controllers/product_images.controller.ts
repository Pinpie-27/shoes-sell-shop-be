import { Request, Response } from "express";
import { productImagesService } from "../services/product_images.service";

class ProductImagesController {
  async getProductImagesById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await productImagesService.getProductImagesById(
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
  async getAllProductImages(req: Request, res: Response) {
    try {
      const result = await productImagesService.getAllProductImages();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createProductImages(req: Request, res: Response) {
    try {
      const newProductImages = req.body;
      const result = await productImagesService.createProductImages(
        newProductImages
      );
      if (result) {
        res.status(201).json({
          message: "Product images created successfully",
          productImage: result,
        });
      } else {
        res.status(400).json({ message: "Failed to create product images" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateProductImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productImagesId = await productImagesService.getProductImagesById(
        Number(id)
      );
      if (!productImagesId) {
        res.status(404).json({ message: "Product images not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await productImagesService.updateProductImages(
        Number(id),
        updatedFields
      );
      if (result) {
        res.status(200).json({ message: "Product images updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update product images" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteProductImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productImagesId = await productImagesService.getProductImagesById(
        Number(id)
      );
      if (!productImagesId) {
        res.status(404).json({ message: "Product images not found" });
        return;
      }
      const result = await productImagesService.deleteProductImages(Number(id));
      if (result) {
        res.status(200).json({ message: "Product images deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete product images" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });}
    }
  }
  export const productImagesController = new ProductImagesController();