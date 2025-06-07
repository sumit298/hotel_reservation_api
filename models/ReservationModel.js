import mongoose from "mongoose";

// Reservation System:

// Create Reservation: Users should be able to create a reservation for a specific room, specifying checkInDate, checkOutDate, and numberOfGuests. Calculate totalPrice.
// View User's Reservations: An API for a user to see their own reservations.
// Cancel Reservation:
// Implement the "2 hours before check-in" cancellation logic.
// Upon successful cancellation, update the reservation status to "cancelled"
const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Number of guests is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total Price is required"],
      min: [0, "Total Price cannot be negative"],
    },
    reservationStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ReservationSchema.pre("save", function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    return next(new Error("Check in date must be after checkout date"));
  }
});

const Reservations = mongoose.model("Reservation", ReservationSchema);

export default Reservations;
