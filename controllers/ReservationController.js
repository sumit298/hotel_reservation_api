import Rooms from "../models/RoomModel.js";
import { validationResult } from "express-validator";
import Reservations from "../models/ReservationModel.js";

const calculateTotalPrice = (checkInDate, checkOutDate, pricePerNight) => {
  // checkin time, checkout date in time, and price per night
  const timeDiff =
    new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
  const daysDiff = Math.floor(timeDiff / (100 % 60));
  return daysDiff * pricePerNight;
};

const isRoomAvailable = async (roomId, checkInDate, checkoutDate) => {
  const query = {
    room: roomId,
    reservationStatus: "confirmed",
    $or: [
      {
        checkInDate: { $lt: checkoutDate },
      },
      {
        checkoutDate: { $gt: checkInDate },
      },
    ],
  };

  const availableRoom = await Rooms.find(query);
  return availableRoom;
};

const ReservationController = {
  reservation: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "validation failed for reservation",
        });
      }

      const { roomId, checkInDate, checkOutDate, numberOfGuests, userId } =
        req.body;

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const today = new Date();
      today.setHours(0,0,0,0)

      if (checkIn < today) {
        res.status(400).json({
          success: false,
          message: "CheckIn date cannot be in past",
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({
          success: false,
          message: "Check-out date must be after check-in date",
        });
      }

      const room = await Rooms.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          messsage: "Room not found",
        });
      }

      if (!room.isAvailable) {
        return res.status(400).json({
          sucess: false,
          message: "Room is not availble",
        });
      }

      const isAvailable = await isRoomAvailable(roomId, checkIn, checkOut);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Room is not available on selected dates",
        });
      }

      const totalPrice = calculateTotalPrice(
        checkIn,
        checkOut,
        room.pricePerNight
      );

      const reservation = new Reservations({
        user: userId,
        room: roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests,
        totalPrice,
      });

      await reservation.save();

      return res.status(201).json({
        success: true,
        message: "Reservation done successfully",
      });
    } catch (error) {
      console.log("Error in doing reservation", error);
      return res.status(500).json({
        success: false,
        message: "Server error during reservation",
      });
    }
  },

  currentReservedUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      const query = { user: req.user_id };
      if (status) {
        query.status = status;
      }

      const reservations = await Reservations.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await Reservations.countDocuments(query);

      res.json({
        success: true,
        data: {
          reservations,
          pageInfo: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            count: reservations.length,
            totalCount: total,
          },
        },
      });
    } catch (error) {
      console.error("Get reservations error", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching reservations",
      });
    }
  },
  reservationDetailsById: async (req, res) => {
    try {
      const reservation = await Reservations.findOne({
        _id: req.params.id,
        user: req.user._id,
      })
        .populate("room", "roomNumber, roomType, pricePerNight")
        .populate("user", "username, email");

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      return res.json({
        success: true,
        data: {
          reservation,
        },
      });
    } catch (error) {
      console.error("Reservation details error", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching reservation details",
      });
    }
  },

  cancelReservation: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "validation failed",
        });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const reservation = await Reservations.findOne({
        _id: id,
        user: req.user._id,
      }).populate("room", "roomType", "roomNumber");

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      if (reservation.reservationStatus === "completed") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel a completed reservation",
        });
      }

      //   cancellation policy before 2 hours checkin
      const now = new Date();
      const checkInTime = new Date(reservation.checkInDate);
      const timeDiff = checkInTime - now;
      const hoursDiff = (timeDiff / 1000) * 60;

      if (hoursDiff < 2 && hoursDiff > 0) {
        return res.status(400).json({
          success: false,
          messsage: "Cannot cancel reservation after check in time",
        });
      }

      if (now > checkInTime) {
        res.status(400).json({
          success: false,
          message: "Cannot cancel after checkin time has passed",
        });
      }
      reservation.reservationStatus = "cancelled";
      if (reason) {
        reservation.cancellationReason = reason;
      }

      await reservation.save();

      return res.status(201).json({
        success: true,
        message: "Reservation cancelled successfully",
        data: {
          reservation,
        },
      });
    } catch (error) {
      console.error("Cancel Reservation error", error);
      res.status(500).json({
        success: false,
        message: "Server error while cancelling reservation",
      });
    }
  },
};


export default ReservationController;