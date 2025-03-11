import { Router } from "express";
import express from 'express';
import { vipLevelsController } from "../controllers/vip_levels.controller";

const router = express.Router();

router.get('/vip_level/:id', vipLevelsController.getVipLevelById);
router.get('/vip_levels', vipLevelsController.getAllVipLevels);
// router.post('/vip_level', vipLevelsController.createVipLevel);
router.put('/vip_level/:id', vipLevelsController.updateVipLevel);
router.delete('/vip_level/:id', vipLevelsController.deleteVipLevel);
router.get('/search/vip_level', vipLevelsController.searchVipLevels);


export const routers = (app : Router) => {
    app.use('/api', router)
}

export default router;