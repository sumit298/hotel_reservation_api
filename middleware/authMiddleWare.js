import mongoose from "mongoose";
import Users from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

const AuthMiddleWare = {
    
    auth: async(req, res, next) => {
        try {
            const token = req.header('Authorization');

            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided'
                })
            }


            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await Users.findById(decoded.userId);

            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "User does not exist"
                })
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                success: false,
                message: "Unable to verify the user"
            })
        }
    }
}

export default AuthMiddleWare;
