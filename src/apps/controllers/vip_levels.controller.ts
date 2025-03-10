import { Request, Response } from "express";
import { vipLevelsService } from "../services/vip_levels.service";

class VipLevelsController{
    async getVipLevelById(req: Request, res: Response){
            try{
                const {id} = req.params;
                const success = await vipLevelsService.getVipLevelById(Number(id));
                if(success){
                    res.status(200).json(success);
                }else{
                    res.status(404).json({message: "Vip level not found"});
                }
            }catch(err){
                res.status(500).json({ message: "Internal Server Error", error: err });
            }
    }
    async getAllVipLevels(req: Request, res: Response){
        try{
            const success = await vipLevelsService.getAllVipLevels();
            res.status(200).json(success);
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
    async updateVipLevel(req: Request, res: Response){
        try{
            const {id} = req.params;
            const updatedFields = req.body;
            const success = await vipLevelsService.updateVipLevel(Number(id), updatedFields);
            if(success){
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
            const success = await vipLevelsService.deleteVipLevel(Number(id));
            if(success){
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
            const success = await vipLevelsService.searchVipLevels(String(keyword));
            res.status(200).json(success);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const vipLevelsController = new VipLevelsController();