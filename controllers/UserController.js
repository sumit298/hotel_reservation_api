import Users from "../models/UserModel.js";
import Reservations from "../models/ReservationModel.js";

const UserController = {
  // @route GET /api/userdata
  // @desc Get all users with their reservations data
  // acces
  userData: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        username,
        email,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;
      const skip = (page - 1) * limit;

      const userFilter = {};

      if (username) {
        userFilter.username = { $regex: username, $options: "i" };
      }
      if (email) {
        userFilter.email = { $regex: email, $options: "i" };
      }

      const users = Users.find(userFilter)
        .select("-password")
        .sort({ [sortBy]: sortOrder ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await Users.countDocuments(userFilter);

      const userIds = (await users).map((user) => user._id);
      const reservations = await Reservations.find({ user: { $in: userIds } })
        .populate("room", "roomId", "roomType", "pricePerNight")
        .sort({ createdAt: -1 });
    } catch (error) {}
  },
};

export default UserController;
