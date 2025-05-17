import { Router } from "express";
import express from "express";
import { stylesController } from "../controllers/styles.controller";

const router = express.Router();
router.get("/style/:id", stylesController.getStyleById);
router.get("/styles", stylesController.getAllStyles);
router.post("/style", stylesController.createStyle);
router.put("/style/:id", stylesController.updateStyle);
router.delete("/style/:id", stylesController.deleteStyle);
router.get("/search/style", stylesController.searchStyles);
export const routers = (app: Router) => {
  app.use("/api", router);
};
export default router;
