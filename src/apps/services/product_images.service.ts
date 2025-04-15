import { productImagesModel } from "../models/product_images.model";

export interface Product_Images {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
}

class ProductImagesService {
  async getProductImagesById(id: number) {
    return await productImagesModel.findById(id);
  }
  async getAllProductImages() {
    return await productImagesModel.getAllProductImages();
  }
  async createProductImages(
    newProductImages: Partial<Product_Images>
  ): Promise<number> {
    return await productImagesModel.createProductImage(newProductImages);
  }
  async updateProductImages(
    id: number,
    updatedFields: Partial<Product_Images>
  ) {
    return await productImagesModel.updateProductImage(id, updatedFields);
  }
  async deleteProductImages(id: number) {
    return await productImagesModel.deleteProductImages(id);
  }
}
export const productImagesService = new ProductImagesService();