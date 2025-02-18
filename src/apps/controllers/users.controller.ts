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
    constructor() {
        this.verifyToken = this.verifyToken.bind(this);
        this.verifyTokenAndAdminAuth = this.verifyTokenAndAdminAuth.bind(this);
    }

    // GET ALL USERS
    async getAllUsers(req:Request, res: Response){
        const users = await usersService.getAllUsers()
        res.status(200).json(users);
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
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await usersService.deleteUser(Number(id));

            if (success) {
                res.status(200).json({ message: `User ${id} deleted successfully` });
            } else {
                res.status(400).json({ message: `Failed to delete user ${id}` });
            }
        } catch (e) {
            res.status(500).json({ message: "Error deleting user" });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedFields = req.body;
            const success = await usersService.updateUser(Number(id), updatedFields);

            if (success) {
                res.status(200).json({ message: `User ${id} updated successfully` });
            } else {
                res.status(400).json({ message: `Failed to update user ${id}` });
            }
        } catch (e) {
            res.status(500).json({ message: "Error updating user" });
        }
    }
    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.token as string;
            if (!token) {
                res.status(401).json({ message: "No token provided" });
                return;
            }

            const accessToken = token.split(" ")[1];
            if (!accessToken) {
                res.status(401).json({ message: "Token format is incorrect" });
                return;
            }

            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string, (err: any, user: any) => {
                if (err) {
                    res.status(403).json({ message: "Token is not valid" });
                    return;
                }
                req.user = user;
                next();
            });

        } catch (err) {
            console.error("Verify Token Error:", err);
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async verifyTokenAndAdminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.verifyToken(req, res, async () => { 
                console.log("Decoded user:", req.user);
            console.log("Request param id:", req.params.id);
                if (!req.user) {
                    res.status(403).json({ message: "User is not authenticated" });
                    return;
                }

                if (String(req.user.id) === req.params.id || req.user.role === 'admin') {
                    return next();
                } else {
                    res.status(403).json({ message: "You are not allowed to delete other users" });
                }
            });
        } catch (err) {
            res.status(401).json({ message: "Token validation failed", error: err });
        }
    }

    
}
export const usersController = new UsersController();