import { Router } from "express";
import express from "express";
import { colorVariantsController } from "../controllers/color_variants.controller";

const router = express.Router();

router.get("/color_variant/:id", colorVariantsController.getColorVariantById);
router.get("/color_variants", colorVariantsController.getAllColorVariants);
router.post("/color_variant", colorVariantsController.createColorVariant);
router.put("/color_variant/:id", colorVariantsController.updateColorVariant);
router.delete("/color_variant/:id", colorVariantsController.deleteColorVariant);
router.get("/search/color_variant", colorVariantsController.searchColorVariantByKeyword);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;