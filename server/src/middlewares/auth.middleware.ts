import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please provide the token!",
        success: false
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found", success: false });
    }

   
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
      error: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
};
