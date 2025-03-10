import { vipLevelsModel } from "../models/vip_levels.model";

export interface VipLevel {
    id: number;
    level_name: string;
    discount_rate: number;
    min_spend: number;
}

class VipLevelsService{
    async getVipLevelById(id: number){
        return await vipLevelsModel.findById(id)
    }
    async getAllVipLevels(){
        return await vipLevelsModel.getAllVipLevels();
    }
    // async createVipLevel(newVipLevel: Partial<VipLevel>) : Promise<number>{
    //     return await vipLevelsModel.createVipLevel(newVipLevel);
    // }

    async updateVipLevel(id: number, updatedFields: Partial<VipLevel>){
        return await vipLevelsModel.updateVipLevel(id, updatedFields);
    }

    async deleteVipLevel(id: number){
        return await vipLevelsModel.deleteVipLevel(id);
    }
    async searchVipLevels(keyword: string){
        return await vipLevelsModel.findByVipLevelName(keyword);
    }
}
export const vipLevelsService = new VipLevelsService();