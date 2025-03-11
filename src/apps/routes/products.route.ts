import { Router } from "express";
import express from 'express';
import { productsController } from "../controllers/products.controller";

const router = express.Router();

router.get('/product/:id', productsController.getProductById);
router.get('/products', productsController.getAllProducts);
router.post('/product', productsController.createProduct);
router.put('/product/:id', productsController.updateProduct);
router.delete('/product/:id', productsController.deleteProduct);
router.get('/search', productsController.searchProductsByKeyword);


export const routers = (app : Router) => {
    app.use('/api', router)
}

export default router;