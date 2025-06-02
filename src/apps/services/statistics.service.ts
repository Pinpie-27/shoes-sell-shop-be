import { statisticsModel } from "../models/statistics.model";

class StatisticsService {
  async getTotalSpentByUsers() {
    return await statisticsModel.getTotalSpentByUsers();
  }
}

export const statisticsService = new StatisticsService();
