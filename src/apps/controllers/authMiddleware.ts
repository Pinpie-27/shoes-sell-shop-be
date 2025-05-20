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

const jwt = require("jsonwebtoken");

class AuthMiddleware {
  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.verifyTokenAndAdminAuth = this.verifyTokenAndAdminAuth.bind(this);
    this.verifyTokenBasic = this.verifyTokenBasic.bind(this);
  }
  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN as string,
        (err: any, user: any) => {
          if (err) {
            res.status(403).json({ message: "Token is not valid" });
            return;
          }

          if (user.role !== "admin") {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
          }

          req.user = user;
          next();
        }
      );
    } catch (err) {
      console.error("Verify Token Error:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  async verifyTokenAndAdminAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.verifyToken(req, res, async () => {
        console.log("Decoded user:", req.user);
        console.log("Request param id:", req.params.id);
        if (!req.user) {
          res.status(403).json({ message: "User is not authenticated" });
          return;
        }

        if (
          String(req.user.id) === req.params.id ||
          req.user.role === "admin"
        ) {
          return next();
        } else {
          res
            .status(403)
            .json({ message: "You are not allowed to action other users" });
        }
      });
    } catch (err) {
      res.status(401).json({ message: "Token validation failed", error: err });
    }
  }

  async verifyTokenBasic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN as string,
        (err: any, user: any) => {
          if (err) {
            res.status(403).json({ message: "Token is not valid" });
            return;
          }

          req.user = user;
          next();
        }
      );
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export const authMiddleware = new AuthMiddleware();
