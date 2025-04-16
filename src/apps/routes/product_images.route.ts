import { Router } from "express";
import express from 'express';
import { productImagesController } from "../controllers/product_images.controller";

const router = express.Router();

router.get('/product_image/:id', productImagesController.getProductImagesById);
router.get('/product_images', productImagesController.getAllProductImages);
router.post('/product_image', productImagesController.createProductImages);
router.put('/product_image/:id', productImagesController.updateProductImages);
router.delete('/product_image/:id', productImagesController.deleteProductImages);


export const routers = (app : Router) => {
    app.use('/api', router)
}

export default router;