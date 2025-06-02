import express, { Router } from "express";
import { statisticsController } from "../controllers/statistics.controller";

const router = express.Router();

router.get("/total-spent-by-users", statisticsController.getTotalSpentByUsers);

export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
