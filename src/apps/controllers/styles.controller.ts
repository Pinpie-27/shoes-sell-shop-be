import { Request, Response } from "express";
import { stylesService } from "../services/styles.service";

class StylesController {
  async getStyleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await stylesService.getStyleById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Style not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllStyles(req: Request, res: Response) {
    try {
      const result = await stylesService.getAllStyles();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createStyle(req: Request, res: Response) {
    try {
      const newStyle = req.body;
      const result = await stylesService.createStyle(newStyle);
      if (result) {
        res
          .status(201)
          .json({ message: "Style created successfully", style: result });
      } else {
        res.status(400).json({ message: "Failed to create style" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async updateStyle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const styleId = await stylesService.getStyleById(Number(id));
      if (!styleId) {
        res.status(404).json({ message: "Style not found" });
        return;
      }
      const updatedFields = req.body;
      const result = await stylesService.updateStyle(Number(id), updatedFields);
      if (result) {
        res.status(200).json({ message: "Style updated successfully" });
      } else {
        res.status(400).json({ message: "Failed to update style" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async deleteStyle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const styleId = await stylesService.getStyleById(Number(id));
      if (!styleId) {
        res.status(404).json({ message: "Style not found" });
        return;
      }
      const result = await stylesService.deleteStyle(Number(id));
      if (result) {
        res.status(200).json({ message: "Style deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete style" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchStyles(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await stylesService.searchStyles(String(keyword));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No styles found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const stylesController = new StylesController();
