import { Request, Response } from "express";
import { vipLevelsService } from "../services/vip_levels.service";

class VipLevelsController{
    async getVipLevelById(req: Request, res: Response){
            try{
                const {id} = req.params;
                const result = await vipLevelsService.getVipLevelById(Number(id));
                if(result){
                    res.status(200).json(result);
                }else{
                    res.status(404).json({message: "Vip level not found"});
                }
            }catch(err){
                res.status(500).json({ message: "Internal Server Error", error: err });
            }
    }
    async getAllVipLevels(req: Request, res: Response){
        try{
            const result = await vipLevelsService.getAllVipLevels();
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    // async createVipLevel(req: Request, res: Response){
    //     try{
    //         const newVipLevel = req.body;
    //         const success = await vipLevelsService.createVipLevel(newVipLevel);
    //         if(success){
    //             res.status(201).json({message: "Vip level created successfully", vip_level: success});
    //         }else{
    //             res.status(400).json({message: "Failed to create vip level"});
    //         }
    //     }catch(err){
    //         res.status(500).json({ message: "Internal Server Error", error: err });
    //     }
    // }
    async updateVipLevel(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const vipLevelId = await vipLevelsService.getVipLevelById(Number(id));
            if (!vipLevelId) {
                res.status(404).json({ message: "Vip level not found" });
                return 
            }
            const updatedFields = req.body;
            const result = await vipLevelsService.updateVipLevel(Number(id), updatedFields);
            if(result){
                res.status(200).json({message: "Vip level updated successfully"});
            }else{
                res.status(400).json({message: "Failed to update vip level"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async deleteVipLevel(req: Request, res: Response){
        try{
            const {id} = req.params;
            const result = await vipLevelsService.deleteVipLevel(Number(id));
            if(result){
                res.status(200).json({message: "Vip level deleted successfully"});
            }else{
                res.status(404).json({message: "Vip level not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async searchVipLevels(req: Request, res: Response){
        try{
            const {keyword} = req.query;
            const result = await vipLevelsService.searchVipLevels(String(keyword));
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const vipLevelsController = new VipLevelsController();