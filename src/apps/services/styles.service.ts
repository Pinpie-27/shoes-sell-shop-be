import { stylesModel } from "../models/styles.model";

export interface Style {
  id: number;
  name: string;
  description: string;
}
class StylesService {
  async getStyleById(id: number) {
    return await stylesModel.findById(id);
  }
  async getAllStyles() {
    return await stylesModel.getAllStyles();
  }
  async createStyle(newStyle: Partial<Style>): Promise<number> {
    return await stylesModel.createStyle(newStyle);
  }
  async updateStyle(id: number, updatedFields: Partial<Style>) {
    return await stylesModel.updateStyle(id, updatedFields);
  }
  async deleteStyle(id: number) {
    return await stylesModel.deleteStyle(id);
  }
  async searchStyles(keyword: string) {
    return await stylesModel.findByStyleName(keyword);
  }
}
export const stylesService = new StylesService();
