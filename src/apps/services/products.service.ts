import { productsModel } from "../models/products.model";

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  style_id: number;
  created_at: string;
  updated_url: string;
}

class ProductsService {
  async getProductById(id: number) {
    return await productsModel.findById(id);
  }
  async getAllProducts() {
    return await productsModel.getAllProducts();
  }
  async createProduct(newProduct: Partial<Product>): Promise<number> {
    return await productsModel.createProduct(newProduct);
  }

  async updateProduct(id: number, updatedFields: Partial<Product>) {
    return await productsModel.updateProduct(id, updatedFields);
  }

  async deleteProduct(id: number) {
    return await productsModel.deleteProduct(id);
  }
  async searchProducts(keyword: string) {
    return await productsModel.findByProductName(keyword);
  }
}
export const productsService = new ProductsService();
