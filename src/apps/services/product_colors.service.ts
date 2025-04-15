import { productColorsModel } from "../models/product_colors.model";

export interface Product_Colors {
    id: number;
    product_id: number;
    color_variant_id: number;
}

class ProductColorsService{
    async getProductColorsById(id: number) {
        return await productColorsModel.findById(id);
    }
    async getAllProductColors() {
        return await productColorsModel.getAllProductColors();
    }
    async createProductColors(
        newProductColors: Partial<Product_Colors>
    ): Promise<number> {
        return await productColorsModel.createProductColor(newProductColors);
    }
    async updateProductColors(
        id: number,
        updatedFields: Partial<Product_Colors>
    ) {
        return await productColorsModel.updateProductColor(id, updatedFields);
    }
    async deleteProductColors(id: number) {
        return await productColorsModel.deleteProductColor(id);
    }
    async getProductColorsByProductId(product_id: number) {
        return await productColorsModel.getProductColorsByProductId(product_id);
    }
}
export const productColorsService = new ProductColorsService();