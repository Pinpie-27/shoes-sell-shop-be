import { categoriesModel } from "../models/categories.model";

export interface Category {
    id: number;
    name: string;
    description: string;
}

class CategoriesService {
    async getCategoryById(id: number){
        return await categoriesModel.findById(id)
    }
    async getAllCategories(){
        return await categoriesModel.getAllCategories();
    }
    async createCategory(newCategory: Partial<Category>) : Promise<number>{
        return await categoriesModel.createCategory(newCategory);
    }
    async updateCategory(id: number, updatedFields: Partial<Category>){
        return await categoriesModel.updateCategory(id, updatedFields);
    }
    async deleteCategory(id: number){
        return await categoriesModel.deleteCategory(id);
    }
    async searchCategories(keyword: string){
        return await categoriesModel.findByCategoryName(keyword);
    }
}
export const categoriesService = new CategoriesService();