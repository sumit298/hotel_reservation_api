import { body } from "express-validator";

const ReservationValidation = [
  body("roomId").isMongoId().withMessage("Valid roomId is required"),
  body("checkInDate")
    .isISO8601()
    .toDate()
    .withMessage("Valid check in date is required"),
  body("checkOutDate")
    .isISO8601()
    .toDate()
    .withMessage("Valid check out date is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password nust be atleast 6 characters long"),
  body("numberOfGuests")
    .isInt({ min: 1 })
    .withMessage("Number of guests should be atleast 1"),
];

export default ReservationValidation;
