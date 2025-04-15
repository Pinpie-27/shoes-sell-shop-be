import { colorVariantModel } from '../models/color_variants.model';
export interface ColorVariant {
    id: number;
    color_id: number;
    variant_name: string;
  }

class ColorVariantsService {
  async getColorVariantById(id: number) {
    return await colorVariantModel.findById(id);
  }
  async getAllColorVariants() {
    return await colorVariantModel.getAllColorVariants();
  }
  async createColorVariant(newColor: Partial<ColorVariant>): Promise<number> {
    return await colorVariantModel.createColorVariant(newColor);
  }
  async updateColorVariant(id: number, updatedFields: Partial<ColorVariant>) {
    return await colorVariantModel.updateColorVariant(id, updatedFields);
  }
  async deleteColorVariant(id: number) {
    return await colorVariantModel.deleteColorVariant(id);
  }
  async searchColorVariants(keyword: string) {
    return await colorVariantModel.findByColorVariantName(keyword);
  }
}
export const colorVariantsService = new ColorVariantsService();