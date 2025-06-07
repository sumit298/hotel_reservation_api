import express from "express";
import registerValidation from "../utils/registerValidation.js";
import AuthController from "../controllers/AuthController.js";
import loginValidation from "../utils/loginValidation.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerValidation, AuthController.register);
AuthRouter.post("/login", loginValidation, AuthController.login);

export default AuthRouter;
