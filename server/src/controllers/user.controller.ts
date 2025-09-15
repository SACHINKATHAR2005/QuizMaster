import { Request,Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface userInfo {
    username: string,
    email: string,
    password: string
}

export const regitserUser = async (req: Request<{}, {}, userInfo>, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "all fields are required !",
                success: false,
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false
            })
        }

        const user = await User.findOne({ $or: [{ email: email }, { username: username }] });

        if (user) {
            return res.status(400).json({
                message: "user alredy exists plz sign in",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        
        await newUser.save();
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            data:newUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "server side error",
            error: (error instanceof Error ? error.message : String(error)),
            success: false
        })
    }
}

export const loginUser = async(req:Request<{},{},userInfo>,res:Response) :Promise<Response>=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"all fields are required !",
                success:false
            })
        }
        
        const userExist = await User.findOne({email})
        if(!userExist){
            return res.status(400).json({
                message:"user does not exist !",
                success:false
            })
        }

        const isMatch = await bcrypt.compare(password,userExist.password);
        if(!isMatch){
            return res.status(400).json({
                message:"enter the correct password",
                success:false
            })
        }
       
    const token = jwt.sign(
  {
    id: userExist._id,
    username: userExist.username,
    email: userExist.email
  },
  process.env.JWT_SECRET!,  
  { expiresIn: "1h" }     
);

 res.cookie("token", token, {
    httpOnly: true,                    
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? undefined : undefined,
    maxAge: 1000 * 60 * 60             
  });

        return res.status(200).json({
            message:"User login successfully!",
            success:true,
            data:{
                id:userExist._id,
                email:userExist.email,
                username:userExist.username
            },
            token:token
        })


    } catch (error) {
         return res.status(500).json({
            message: "server side error",
            error: (error instanceof Error ? error.message : String(error)),
            success: false
        })
    }
}