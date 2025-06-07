import { body, validationResult } from "express-validator";

const CancelReasonValidation = [
  body("cancellationReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Cancellation cannot exceed 500 characters"),
];

export default CancelReasonValidation;
