import { Request, Response } from "express";
import { colorsService } from "../services/colors.service";

class ColorsController {
  async getColorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await colorsService.getColorById(Number(id));
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Color not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async getAllColors(req: Request, res: Response) {
    try {
      const result = await colorsService.getAllColors();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async createColor(req: Request, res: Response) {
    try {
      const newColor = req.body;
      const result = await colorsService.createColor(newColor);
      if (result) {
        res.status(201).json({ message: "Color created successfully" });
      } else {
        res.status(400).json({ message: "Failed to create color" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async updateColor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colorId = await colorsService.getColorById(Number(id));
      if (!colorId) {
        res.status(404).json({ message: "Color not found" });
      }
      const updatedFields = req.body;
      const result = await colorsService.updateColor(Number(id), updatedFields);
      if (result) {
        res.status(200).json({ message: "Color updated succesfully" });
      } else {
        res.status(400).json({ message: "Failed to update color" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async deleteColor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const colorId = await colorsService.getColorById(Number(id));
      if (!colorId) {
        res.status(404).json({ message: "Color not found" });
      }
      const result = await colorsService.deleteColor(Number(id));
      if (result) {
        res.status(200).json({ message: "Color deleted successfully" });
      } else {
        res.status(400).json({ message: "Failed to delete color" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  async searchColorByKeyword(req: Request, res: Response) {
    try {
      const { keyword } = req.query;
      const result = await colorsService.searchColors(String(keyword));
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const colorsController = new ColorsController();