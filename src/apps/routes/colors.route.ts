import { Router } from "express";
import express from "express";
import { colorsController } from "../controllers/colors.controller";

const router = express.Router();

router.get("/color/:id", colorsController.getColorById);
router.get("/colors", colorsController.getAllColors);
router.post("/color", colorsController.createColor);
router.put("/color/:id", colorsController.updateColor);
router.delete("/color/:id", colorsController.deleteColor);
router.get("/search/color", colorsController.searchColorByKeyword);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;