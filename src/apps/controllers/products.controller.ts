import { Request, Response } from "express";
import { productsService } from "../services/products.service";

class ProductsController{
    async getProductById(req: Request, res: Response){
        try{
            const {id} = req.params;
            const result = await productsService.getProductById(Number(id));
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({message: "Product not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getAllProducts(req: Request, res: Response){
        try{
            const result = await productsService.getAllProducts();
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createProduct(req: Request, res: Response){
        try{
            const newProduct = req.body;
            const result = await productsService.createProduct(newProduct);
            if(result){
                res.status(201).json({message: "Product created successfully", product: result});
            }else{
                res.status(400).json({message: "Failed to create product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const productId = await productsService.getProductById(Number(id));
            if (!productId) {
                res.status(404).json({ message: "Product not found" });
                return 
            }
            const updatedFields = req.body;
            const result = await productsService.updateProduct(Number(id), updatedFields);
            if(result){
                res.status(200).json({message: "Product updated successfully"});
            }else{
                res.status(400).json({message: "Failed to update product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const productId = await productsService.getProductById(Number(id));
            if (!productId) {
                res.status(404).json({ message: "Product not found" });
                return 
            }
            const result = await productsService.deleteProduct(Number(id));
            if(result){
                res.status(200).json({message: "Product deleted successfully"});
            }else{
                res.status(404).json({message: "Product not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async searchProductsByKeyword(req: Request, res: Response){
        try{
            const { keyword } = req.query;
            const result = await productsService.searchProducts(keyword as string);
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const productsController = new ProductsController();