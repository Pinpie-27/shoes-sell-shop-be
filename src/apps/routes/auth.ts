import { Router } from "express";
import express from 'express';
import { usersController } from "../controllers/users.controller";

const router = express.Router();

router.post('/login', usersController.loginUser);
router.get('/users', usersController.verifyToken, usersController.getAllUsers);
router.put('/update/:id', usersController.updateUser);
router.delete('/delete/:id',usersController.verifyTokenAndAdminAuth, usersController.deleteUser);
router.post('/register', usersController.registerUser);

export const routers = (app : Router) => {
    app.use('/api', router)
}