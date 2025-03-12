import { NextFunction, Request, Response } from "express";
import { usersService } from "../services/users.service";



declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }


export interface CreateUserRequest {
    id: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    vip_level_id: number;
    created_at: string; 
    role: string;
}

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class UsersController {

    // GET ALL USERS
    async getAllUsers(req:Request, res: Response){
        const users = await usersService.getAllUsers()
        res.status(200).json(users);
    }

    // GET USER BY ID
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await usersService.getUserById(Number(id));

            if (result) {
                const { password, ...userWithoutPassword } = result;
                res.status(200).json(userWithoutPassword);
            } else {
                res.status(400).json({ message: `User with id ${id} not found` });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }


    // Register
    async registerUser(req:Request, res: Response){
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser: CreateUserRequest = {
                id: req.body.id,
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                phone: req.body.phone,
                address: req.body.address,
                vip_level_id: req.body.vip_level_id,
                created_at: new Date().toISOString(),
                role: req.body.role || 'user'
            };

            // Save to database 
            const user = await usersService.createUser(newUser);
            res.status(201).json({ message: "User created successfully", user });
        }catch(err){
            res.status(500).json(err);
        }
    }

    // Login
    async loginUser(req:Request, res: Response){
        try{
            const user = await usersService.loginUser(req.body.username, req.body.password);
            if(!user){
                res.status(404).json("Wrong username!")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword){
                res.status(404).json("Wrong password!")
            }            
            if(user && validPassword){
            const accessToken = jwt.sign({
                    id: user.id,
                    role: user.role
                },
            process.env.JWT_ACCESS_TOKEN as string,
            {expiresIn: "30d"}
            );
                const userObject = user.toObject ? user.toObject() : user;
                const { password, ...others } = userObject;
                res.status(200).json({...others, accessToken});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    // DELETE USER
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = await usersService.getUserById(Number(id));
            if (!userId) {
                res.status(404).json({ message: "User not found" });
                return 
            }
            const result = await usersService.deleteUser(Number(id));

            if (result) {
                res.status(200).json({ message: `User ${id} deleted successfully` });
            } else {
                res.status(400).json({ message: `Failed to delete user ${id}` });
            }
        } catch (e) {
            res.status(500).json({ message: "Error deleting user" });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = await usersService.getUserById(Number(id));
            if (!userId) {
                res.status(404).json({ message: "User not found" });
                return 
            }
            const updatedFields = req.body;
            const result = await usersService.updateUser(Number(id), updatedFields);

            if (result) {
                res.status(200).json({ message: `User ${id} updated successfully` });
            } else {
                res.status(400).json({ message: `Failed to update user ${id}` });
            }
        } catch (e) {
            res.status(500).json({ message: "Error updating user" });
        }
    }
    
}
export const usersController = new UsersController();