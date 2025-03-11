import { Request, Response } from "express";
import { productsService } from "../services/products.service";

class ProductsController{
    async getProductById(req: Request, res: Response){
        try{
            const {id} = req.params;
            const success = await productsService.getProductById(Number(id));
            if(success){
                res.status(200).json(success);
            }else{
                res.status(404).json({message: "Product not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getAllProducts(req: Request, res: Response){
        try{
            const success = await productsService.getAllProducts();
            res.status(200).json(success);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createProduct(req: Request, res: Response){
        try{
            const newProduct = req.body;
            const success = await productsService.createProduct(newProduct);
            if(success){
                res.status(201).json({message: "Product created successfully", product: success});
            }else{
                res.status(400).json({message: "Failed to create product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateProduct(req: Request, res: Response){
        try{
            const {id} = req.params;
            const updatedFields = req.body;
            const success = await productsService.updateProduct(Number(id), updatedFields);
            if(success){
                res.status(200).json({message: "Product updated successfully"});
            }else{
                res.status(400).json({message: "Failed to update product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteProduct(req: Request, res: Response){
        try{
            const {id} = req.params;
            const success = await productsService.deleteProduct(Number(id));
            if(success){
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
            const success = await productsService.searchProducts(keyword as string);
            res.status(200).json(success);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const productsController = new ProductsController();