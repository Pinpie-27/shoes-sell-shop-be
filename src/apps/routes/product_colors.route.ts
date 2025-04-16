import { Router } from "express";
import express from 'express';
import { productColorsController } from "../controllers/product_colors.controller";

const router = express.Router();

router.get('/product_color/:id', productColorsController.getProductColorsById);
router.get('/product_colors', productColorsController.getAllProductColors);
router.post('/product_color', productColorsController.createProductColors);
router.put('/product_color/:id', productColorsController.updateProductColors);
router.delete('/product_color/:id', productColorsController.deleteProductColors);
router.get('/product_color/product/:product_id', productColorsController.getProductColorsByProductId);

export const routers = (app : Router) => {
    app.use('/api', router)
}
export default router;