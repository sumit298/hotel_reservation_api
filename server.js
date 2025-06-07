import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./routes/auth.routes.js";
import UserRouter from "./routes/User.routes.js";
import ReservationRouter from "./routes/reservation.routes.js";
import RoomsRouter from "./routes/rooms.routes.js";
import morgan from "morgan";

dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("mongodb is connected"))
  .catch((err) => console.log(err));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/reserve", ReservationRouter);
app.use('/api/v1/rooms', RoomsRouter);
const port = process.env.PORT || 5050;

app.get("/", (req, res) => {
  res.send({
    message: "Hotel Reservation",
    status: "Active",
  });
});

app.listen(port, () => console.log(`Server up and running on PORT:${port}`));
