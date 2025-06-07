import { body, validationResult } from "express-validator";

const loginValidation = [
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password is required"),
];


export default loginValidation;