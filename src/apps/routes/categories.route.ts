import { Router } from "express";
import express from 'express';
import { categoriesController } from "../controllers/categories.controller";

const router = express.Router();

router.get('/category/:id', categoriesController.getVipLevelById);
router.get('/categories', categoriesController.getAllCategories);
router.post('/category', categoriesController.createCategory);
router.put('/category/:id', categoriesController.updateCategory);
router.delete('/category/:id', categoriesController.deleteCategory);
router.get('/search/category', categoriesController.searchCategoriesByKeyword);


export const routers = (app : Router) => {
    app.use('/api', router)
}

export default router;