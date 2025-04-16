import { colorsModel } from "../models/colors.model";

export interface Color {
  id: number;
  name: string;
  hex_code: string;
}

class ColorsService {
  async getColorById(id: number) {
    return await colorsModel.findById(id);
  }
  async getAllColors() {
    return await colorsModel.getAllColors();
  }
  async createColor(newColor: Partial<Color>): Promise<number> {
    return await colorsModel.createColor(newColor);
  }
  async updateColor(id: number, updatedFields: Partial<Color>) {
    return await colorsModel.updateColor(id, updatedFields);
  }
  async deleteColor(id: number) {
    return await colorsModel.deleteColor(id);
  }
  async searchColors(keyword: string) {
    return await colorsModel.findByColorName(keyword);
  }
}
export const colorsService = new ColorsService();