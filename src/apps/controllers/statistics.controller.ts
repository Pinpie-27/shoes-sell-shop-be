import { Request, Response } from "express";
import { statisticsService } from "../services/statistics.service";

class StatisticsController {
  async getTotalSpentByUsers(req: Request, res: Response): Promise<void> {
    try {
      const data = await statisticsService.getTotalSpentByUsers();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Lỗi server" });
    }
  }
}

export const statisticsController = new StatisticsController();
