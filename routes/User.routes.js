import express from 'express'
import UserController from '../controllers/UserController.js'
import AuthMiddleWare from '../middleware/authMiddleWare.js';

const UserRouter = express.Router();

UserRouter.get('/userData', AuthMiddleWare.auth, UserController.userData);

export default UserRouter;