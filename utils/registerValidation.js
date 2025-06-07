import { body, validationResult } from "express-validator";

const registerValidation = [
  body("username")
    .trim()
    .isLength({ max: 30, min: 3 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password nust be atleast 6 characters long"),
];


export default registerValidation;