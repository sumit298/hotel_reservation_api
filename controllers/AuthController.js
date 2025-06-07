import mongoose from "mongoose";
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/generateToken.js";

const AuthController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "validation failed",
        });
      }

      const { username, email, password } = req.body;

      const existingUser = await Users.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with email or username already exists",
        });
      }
      const user = new Users({ username, email, password });
      await user.save();

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        messsage: "User registered successfully",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Registration error", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  },
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "validation failed",
        });
      }

      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "Invalid Creds",
        });
      }

      // checking password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const token = generateToken(user._id);
      res.json({
        success: true,
        message: "Login Successful",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Login Error", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  },
};

export default AuthController;
