import { Router } from "express";
import express from 'express';
import { usersController } from "../controllers/users.controller";
import { authMiddleware } from "../controllers/authMiddleware";

const router = express.Router();

router.post('/login', usersController.loginUser);
router.get('/users', authMiddleware.verifyToken, usersController.getAllUsers);
router.get('/user/:id', usersController.getUserById);
router.put('/update/:id',authMiddleware.verifyTokenAndAdminAuth, usersController.updateUser);
router.delete('/delete/:id',authMiddleware.verifyTokenAndAdminAuth, usersController.deleteUser);
router.post('/register', usersController.registerUser);

export const routers = (app : Router) => {
    app.use('/api', router)
}
export default router;