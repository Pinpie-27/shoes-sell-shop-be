import { suppliersModel } from "../models/suppliers.model";
export interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

class SuppliersService {
  async getSupplierById(id: number) {
    return await suppliersModel.findById(id);
  }
  async getAllSuppliers() {
    return await suppliersModel.getAllSuppliers();
  }
  async createSupplier(newSupplier: Partial<Supplier>): Promise<number> {
    return await suppliersModel.createSupplier(newSupplier);
  }
  async updateSupplier(id: number, updatedFields: Partial<Supplier>) {
    return await suppliersModel.updateSupplier(id, updatedFields);
  }
  async deleteSupplier(id: number) {
    return await suppliersModel.deleteSupplier(id);
  }
  async searchSuppliers(keyword: string) {
    return await suppliersModel.findBySupplierName(keyword);
  }
}
export const suppliersService = new SuppliersService();
