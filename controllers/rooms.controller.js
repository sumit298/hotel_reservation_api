import Rooms from "../models/RoomModel.js";
import mongoose from "mongoose";

const RoomController = {
  create: async (req, res) => {
    try {
      const { roomNumber, roomType, pricePerNight, isAvailable } = req.body;

      const Room = new Rooms({
        roomNumber,
        roomType,
        pricePerNight,
        isAvailable,
      });

      await Room.save();

      return res.status(200).json({
        success: true,
        message: "Room created successfully",
        Rooms,
      });
    } catch (error) {
      console.error("Error while creating rooms", error);
      return res.status(500).json({
        success: false,
        message: "Error in creating rooms",
      });
    }
  },

  fetchAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, roomType } = req.query;
      const skip = (page - 1) * limit;

      const roomFilter = {};

      if (roomType) {
        roomFilter.roomType = roomType;
      }

      const rooms = await Rooms.find(roomFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await Reservations.countDocuments(roomFilter);

       return res.json({
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
        console.error("Error while fetching rooms", error)
        return res.status(500).json({
            success: false,
            message: "Server Error while fetching rooms"
        })
    }
  },
  fetchRoomById: async(req, res)=> {
    try {
        const {id} = req.body;

        const room = await Rooms.findById(id)
        if(!room){
            return res.status(404).json({
                success: false,
                message: `Room ${id} not found`
            })
        }
        return res.status(201).json({
            success: true,
            message: `Room ${id} found successfully`,
            room
        })
    } catch (error) {
        console.error("Error while fetching roomid");
        return res.status(500).json({
            success: false,
            message: "Server Error while fetching room Id"
        })
    }
  }
};

export default RoomController;
